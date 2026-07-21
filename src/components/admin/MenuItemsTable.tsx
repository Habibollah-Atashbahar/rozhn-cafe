"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/types";
import { formatToman } from "@/lib/utils";
import { api } from "@/lib/api";

export default function MenuItemsTable({
  items,
  categories,
  onChanged,
  onEdit,
}: {
  items: MenuItem[];
  categories: MenuCategory[];
  onChanged: () => void;
  onEdit: (item: MenuItem) => void;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  function categoryTitle(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.title ?? categoryId;
  }

  async function toggleAvailable(item: MenuItem) {
    setPendingId(item.id);
    try {
      await api.updateMenuItem(item.id, { available: !item.available });
      onChanged();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`محصول «${item.name}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;
    setPendingId(item.id);
    try {
      await api.deleteMenuItem(item.id);
      onChanged();
    } finally {
      setPendingId(null);
    }
  }

  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-graphite-400">محصولی برای نمایش نیست</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] table-fixed text-sm">
        <thead>
          <tr className="border-b border-graphite-200 text-right text-xs text-graphite-500">
            <th className="w-[24%] py-3 font-medium">نام</th>
            <th className="w-[18%] py-3 font-medium">دسته‌بندی</th>
            <th className="w-[16%] py-3 font-medium">قیمت</th>
            <th className="w-[14%] py-3 text-center font-medium">موجود</th>
            <th className="w-[28%] py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-graphite-100 last:border-none">
              <td className="truncate py-3 font-medium text-ink-900">{item.name}</td>
              <td className="truncate py-3 text-graphite-600">{categoryTitle(item.categoryId)}</td>
              <td className="whitespace-nowrap py-3 text-graphite-600">
                {formatToman(item.basePrice)}
              </td>
              <td className="py-3 text-center">
                <button
                  onClick={() => toggleAvailable(item)}
                  disabled={pendingId === item.id}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                    item.available
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-graphite-100 text-graphite-500"
                  }`}
                >
                  {item.available ? "موجود" : "ناموجود"}
                </button>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center gap-1 rounded-full border border-graphite-200 px-3 py-1.5 text-[11px] text-ink-900 hover:border-ink-900"
                  >
                    <Pencil size={12} /> ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={pendingId === item.id}
                    className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-[11px] text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={12} /> حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
