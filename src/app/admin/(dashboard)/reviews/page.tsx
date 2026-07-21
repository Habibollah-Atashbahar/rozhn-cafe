"use client";

import { useState } from "react";
import { useAdminReviews } from "@/lib/hooks/useReviews";
import { useMenu } from "@/lib/hooks/useMenu";
import { toPersianDigits } from "@/lib/utils";
import ReviewsTable from "@/components/admin/ReviewsTable";

type Filter = "pending" | "approved" | "all";

export default function AdminReviewsPage() {
  const { reviews, isLoading, refresh } = useAdminReviews();
  const { menuItems } = useMenu();
  const [filter, setFilter] = useState<Filter>("pending");

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-ink-900">
          نظرات مشتریان{" "}
          <span className="text-graphite-400">({toPersianDigits(filtered.length)})</span>
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: "pending" as const, label: `در انتظار تایید (${toPersianDigits(pendingCount)})` },
          { value: "approved" as const, label: "تاییدشده" },
          { value: "all" as const, label: "همه" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value
                ? "border-ink-900 bg-ink-900 text-bone-50"
                : "border-graphite-200 text-graphite-600 hover:border-graphite-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-graphite-200/70 bg-white/70 p-5">
        {isLoading ? (
          <p className="py-8 text-center text-xs text-graphite-400">در حال بارگذاری...</p>
        ) : (
          <ReviewsTable reviews={filtered} menuItems={menuItems} onChanged={refresh} />
        )}
      </div>
    </div>
  );
}
