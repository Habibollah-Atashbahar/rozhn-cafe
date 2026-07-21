"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMenu } from "@/lib/hooks/useMenu";
import { toPersianDigits } from "@/lib/utils";
import type { MenuItem } from "@/types";
import MenuItemsTable from "@/components/admin/MenuItemsTable";
import MenuItemForm from "@/components/admin/MenuItemForm";

export default function AdminMenuPage() {
  const { categories, menuItems, isLoading, refreshMenuItems } = useMenu();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<MenuItem | "new" | null>(null);

  const filtered =
    categoryFilter === "all"
      ? menuItems
      : menuItems.filter((m) => m.categoryId === categoryFilter);

  function handleSaved() {
    setEditingItem(null);
    refreshMenuItems();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-ink-900">
          مدیریت محصولات{" "}
          <span className="text-graphite-400">({toPersianDigits(filtered.length)})</span>
        </h1>
        <button
          onClick={() => setEditingItem("new")}
          className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-bone-50 hover:bg-ink-800"
        >
          <Plus size={14} /> افزودن محصول
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            categoryFilter === "all"
              ? "border-ink-900 bg-ink-900 text-bone-50"
              : "border-graphite-200 text-graphite-600 hover:border-graphite-400"
          }`}
        >
          همه
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              categoryFilter === c.id
                ? "border-ink-900 bg-ink-900 text-bone-50"
                : "border-graphite-200 text-graphite-600 hover:border-graphite-400"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-graphite-200/70 bg-white/70 p-5">
        {isLoading ? (
          <p className="py-8 text-center text-xs text-graphite-400">در حال بارگذاری...</p>
        ) : (
          <MenuItemsTable
            items={filtered}
            categories={categories}
            onChanged={refreshMenuItems}
            onEdit={setEditingItem}
          />
        )}
      </div>

      {editingItem && (
        <MenuItemForm
          item={editingItem === "new" ? undefined : editingItem}
          categories={categories}
          onSaved={handleSaved}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
