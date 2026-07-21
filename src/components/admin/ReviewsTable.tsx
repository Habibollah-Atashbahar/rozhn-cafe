"use client";

import type { MenuItem, Review } from "@/types";
import { Check, Trash2, X } from "lucide-react";
import StarRating from "@/components/reviews/StarRating";
import { api } from "@/lib/api";

export default function ReviewsTable({
  reviews,
  menuItems,
  onChanged,
}: {
  reviews: Review[];
  menuItems: MenuItem[];
  onChanged?: () => void;
}) {
  function itemName(itemId?: string) {
    if (!itemId) return "نظر کلی درباره کافه";
    return menuItems.find((m) => m.id === itemId)?.name ?? "محصول حذف‌شده";
  }

  async function setApproval(id: string, approved: boolean) {
    await api.setReviewApproval(id, approved);
    onChanged?.();
  }

  async function remove(id: string) {
    await api.deleteReview(id);
    onChanged?.();
  }

  if (reviews.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-graphite-400">
        نظری برای نمایش وجود ندارد
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-card border border-graphite-200/70 bg-white/70 p-4"
        >
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink-900">
                {review.customerName}
              </span>
              <StarRating value={review.rating} />
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                review.approved
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {review.approved ? "تاییدشده" : "در انتظار تایید"}
            </span>
          </div>

          <span className="mb-1 inline-block rounded-full bg-bone-200 px-2 py-0.5 text-[10px] font-medium text-graphite-600">
            {itemName(review.itemId)}
          </span>

          <p className="mt-1 text-xs leading-6 text-graphite-600">{review.comment}</p>

          <div className="mt-3 flex items-center gap-2">
            {!review.approved && (
              <button
                onClick={() => setApproval(review.id, true)}
                className="flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-600 hover:bg-emerald-50"
              >
                <Check size={13} /> تایید
              </button>
            )}
            {review.approved && (
              <button
                onClick={() => setApproval(review.id, false)}
                className="flex items-center gap-1 rounded-full border border-amber-200 px-3 py-1.5 text-[11px] font-medium text-amber-600 hover:bg-amber-50"
              >
                <X size={13} /> لغو تایید
              </button>
            )}
            <button
              onClick={() => remove(review.id)}
              className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-50"
            >
              <Trash2 size={13} /> حذف
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
