"use client";

import type { MenuItem, Review } from "@/types";
import StarRating from "./StarRating";

export default function ReviewsList({
  reviews,
  menuItems,
  emptyMessage = "هنوز نظری برای این بخش ثبت نشده است",
}: {
  reviews: Review[];
  menuItems: MenuItem[];
  emptyMessage?: string;
}) {
  function itemName(itemId?: string) {
    if (!itemId) return null;
    return menuItems.find((m) => m.id === itemId)?.name ?? null;
  }

  if (reviews.length === 0) {
    return <p className="py-8 text-center text-xs text-graphite-400">{emptyMessage}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-card border border-graphite-200/70 bg-white/60 p-4"
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink-900">{review.customerName}</span>
            <StarRating value={review.rating} />
          </div>
          {itemName(review.itemId) && (
            <span className="mb-1 inline-block rounded-full bg-bone-200 px-2 py-0.5 text-[10px] font-medium text-graphite-600">
              {itemName(review.itemId)}
            </span>
          )}
          <p className="mt-1 text-xs leading-6 text-graphite-600">{review.comment}</p>
          <p className="mt-2 text-[10px] text-graphite-400">
            {new Date(review.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </li>
      ))}
    </ul>
  );
}
