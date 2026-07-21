"use client";

import { Sparkles } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatToman } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";

export default function StaffPicks({ items }: { items: MenuItem[] }) {
  const addLine = useCartStore((s) => s.addLine);
  const picks = items.filter((i) => i.staffPick && i.available);

  if (picks.length === 0) return null;

  function priceFor(item: MenuItem) {
    const delta =
      item.optionGroups?.reduce((sum, g) => sum + (g.choices[0]?.priceDelta ?? 0), 0) ?? 0;
    return item.basePrice + delta;
  }

  function handleAdd(item: MenuItem) {
    // برای انتخاب سریع، گزینه‌ی پیش‌فرض (اولین گزینه) هر گروه انتخاب می‌شود
    const selectedOptions =
      item.optionGroups?.map((group) => {
        const choice = group.choices[0];
        return {
          groupTitle: group.title,
          choiceLabel: choice?.label ?? "",
          priceDelta: choice?.priceDelta ?? 0,
        };
      }) ?? [];

    addLine({
      itemId: item.id,
      name: item.name,
      unitPrice: item.basePrice,
      selectedOptions,
    });
  }

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-1.5">
        <Sparkles size={16} className="text-amber-500" />
        <h2 className="text-sm font-bold text-ink-900">پیشنهاد باریستاهای رژن</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {picks.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAdd(item)}
            className="flex w-40 shrink-0 flex-col gap-2 rounded-card border border-amber-200/70 bg-amber-50/40 p-3 text-right transition-shadow hover:shadow-md"
          >
            {item.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-full rounded-lg object-cover"
                loading="lazy"
              />
            )}
            <div>
              <p className="text-xs font-semibold text-ink-900">{item.name}</p>
              <p className="mt-0.5 text-[11px] text-graphite-500">
                {formatToman(priceFor(item))}
                {item.optionGroups && item.optionGroups.length > 0 && (
                  <span className="text-graphite-400"> ({item.optionGroups[0]!.choices[0]?.label})</span>
                )}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
