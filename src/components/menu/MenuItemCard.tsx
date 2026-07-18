"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/types";
import { cn, formatToman } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const addLine = useCartStore((s) => s.addLine);

  const [selected, setSelected] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    item.optionGroups?.forEach((_, gi) => {
      init[gi] = 0;
    });
    return init;
  });
  const [justAdded, setJustAdded] = useState(false);

  const priceDelta = useMemo(() => {
    if (!item.optionGroups) return 0;
    return item.optionGroups.reduce((sum, group, gi) => {
      const choice = group.choices[selected[gi] ?? 0];
      return sum + (choice?.priceDelta ?? 0);
    }, 0);
  }, [item.optionGroups, selected]);

  const finalPrice = item.basePrice + priceDelta;

  function handleAdd() {
    const selectedOptions =
      item.optionGroups?.map((group, gi) => {
        const choice = group.choices[selected[gi] ?? 0]!;
        return {
          groupTitle: group.title,
          choiceLabel: choice.label,
          priceDelta: choice.priceDelta,
        };
      }) ?? [];

    addLine({
      itemId: item.id,
      name: item.name,
      unitPrice: item.basePrice,
      selectedOptions,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  }

  if (!item.available) return null;

  return (
    <div className="flex flex-col gap-3 rounded-card border border-graphite-200/70 bg-white/60 p-4 shadow-soft transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink-900">
            {item.name}
            {item.seasonal && (
              <span className="mr-2 rounded-full bg-bone-200 px-2 py-0.5 text-[10px] font-medium text-graphite-600 align-middle">
                فصلی
              </span>
            )}
          </h3>
          {item.description && (
            <p className="mt-1 text-xs leading-5 text-graphite-500">{item.description}</p>
          )}
        </div>
        <span className="whitespace-nowrap text-sm font-semibold text-ink-800">
          {formatToman(finalPrice)}
        </span>
      </div>

      {item.optionGroups && item.optionGroups.length > 0 && (
        <div className="flex flex-col gap-2">
          {item.optionGroups.map((group, gi) => (
            <div key={group.title} className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-graphite-400">{group.title}:</span>
              {group.choices.map((choice, ci) => (
                <button
                  key={choice.id}
                  onClick={() => setSelected((s) => ({ ...s, [gi]: ci }))}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                    selected[gi] === ci
                      ? "border-ink-900 bg-ink-900 text-bone-50"
                      : "border-graphite-200 text-graphite-600 hover:border-graphite-400"
                  )}
                >
                  {choice.label}
                  {choice.priceDelta > 0 ? ` +${Math.round(choice.priceDelta / 1000)}k` : ""}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAdd}
        className={cn(
          "mt-1 flex items-center justify-center gap-1.5 self-start rounded-full border px-4 py-2 text-xs font-medium transition-all",
          justAdded
            ? "border-ink-900 bg-ink-900 text-bone-50"
            : "border-graphite-300 text-ink-900 hover:border-ink-900"
        )}
      >
        <Plus size={14} />
        {justAdded ? "افزوده شد" : "افزودن به سبد"}
      </button>
    </div>
  );
}
