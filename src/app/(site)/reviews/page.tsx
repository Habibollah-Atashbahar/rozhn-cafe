"use client";

import { useMemo, useState } from "react";
import { useMenu } from "@/lib/hooks/useMenu";
import { useReviews } from "@/lib/hooks/useReviews";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewsList from "@/components/reviews/ReviewsList";

type Mode = "all" | "byProduct";

export default function ReviewsPage() {
  const { categories, menuItems, isLoading: menuLoading } = useMenu();
  const [mode, setMode] = useState<Mode>("all");
  const [categoryId, setCategoryId] = useState("");
  const [itemId, setItemId] = useState("");

  const itemsInCategory = useMemo(
    () => menuItems.filter((m) => m.categoryId === categoryId),
    [menuItems, categoryId]
  );

  const { reviews: allReviews, isLoading: allLoading } = useReviews();
  const { reviews: itemReviews, isLoading: itemLoading } = useReviews(
    mode === "byProduct" ? itemId : undefined
  );

  const showingReviews = mode === "all" ? allReviews : itemId ? itemReviews : [];
  const loading = mode === "all" ? allLoading : itemLoading;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-xl font-bold text-ink-900">نظرات مشتریان</h1>
      <p className="mb-6 text-sm text-graphite-500">
        تجربه‌تان از رژن یا هر یک از محصولات منو را با ما و دیگران به اشتراک بگذارید.
      </p>

      <div className="mb-8">
        <ReviewForm menuItems={menuItems} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setMode("all");
            setCategoryId("");
            setItemId("");
          }}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            mode === "all"
              ? "border-ink-900 bg-ink-900 text-bone-50"
              : "border-graphite-200 text-graphite-600 hover:border-graphite-400"
          }`}
        >
          همه نظرات
        </button>
        <button
          onClick={() => setMode("byProduct")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            mode === "byProduct"
              ? "border-ink-900 bg-ink-900 text-bone-50"
              : "border-graphite-200 text-graphite-600 hover:border-graphite-400"
          }`}
        >
          نظرات یک محصول خاص
        </button>
      </div>

      {mode === "byProduct" && !menuLoading && (
        <div className="mb-6 grid grid-cols-2 gap-2">
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setItemId("");
            }}
            className="rounded-lg border border-graphite-200 bg-white px-3 py-2.5 text-sm focus:border-ink-900 focus:outline-none"
          >
            <option value="">دسته‌بندی را انتخاب کنید</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            disabled={!categoryId}
            className="rounded-lg border border-graphite-200 bg-white px-3 py-2.5 text-sm focus:border-ink-900 focus:outline-none disabled:opacity-50"
          >
            <option value="">محصول را انتخاب کنید</option>
            {itemsInCategory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="rounded-card border border-graphite-200/70 bg-white/40 p-5">
        {loading ? (
          <p className="py-8 text-center text-xs text-graphite-400">در حال بارگذاری...</p>
        ) : mode === "byProduct" && !itemId ? (
          <p className="py-8 text-center text-xs text-graphite-400">
            یک دسته‌بندی و محصول انتخاب کنید تا نظرات آن نمایش داده شود
          </p>
        ) : (
          <ReviewsList reviews={showingReviews} menuItems={menuItems} />
        )}
      </div>
    </div>
  );
}
