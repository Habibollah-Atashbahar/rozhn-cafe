"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { MenuItem } from "@/types";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import StarRating from "./StarRating";

export default function ReviewForm({ menuItems }: { menuItems: MenuItem[] }) {
  const [name, setName] = useState("");
  const [itemId, setItemId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (name.trim().length < 2) newErrors.name = "نام خود را کامل وارد کنید";
    if (comment.trim().length < 5) newErrors.comment = "نظر شما خیلی کوتاه است";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await api.createReview({
        customerName: name.trim(),
        itemId: itemId || undefined,
        rating,
        comment: comment.trim(),
      });
      setSuccess(true);
      setName("");
      setItemId("");
      setRating(5);
      setComment("");
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? "ثبت نظر با خطا مواجه شد. لطفاً دوباره تلاش کنید."
          : "اتصال به سرور برقرار نشد."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-graphite-200/70 bg-white/70 p-6 text-center">
        <CheckCircle2 size={36} className="text-ink-900" strokeWidth={1.4} />
        <p className="text-sm font-medium text-ink-900">نظر شما ثبت شد</p>
        <p className="text-xs text-graphite-500">
          پس از بررسی و تایید توسط کافه، نظرتان در همین صفحه نمایش داده می‌شود.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-1 rounded-full border border-graphite-300 px-4 py-1.5 text-xs font-medium text-ink-900 hover:border-ink-900"
        >
          ثبت نظر دیگر
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-card border border-graphite-200/70 bg-white/70 p-5"
    >
      <h3 className="text-sm font-bold text-ink-900">ثبت نظر شما</h3>

      <div>
        <label className="mb-1 block text-xs font-medium text-graphite-600">نام شما</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none",
            errors.name ? "border-red-400" : "border-graphite-200 focus:border-ink-900"
          )}
          placeholder="مثلاً رضا خانزهی"
        />
        {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-graphite-600">
          محصول مورد نظر <span className="text-graphite-400">(اختیاری)</span>
        </label>
        <select
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="w-full rounded-lg border border-graphite-200 bg-white px-3 py-2.5 text-sm focus:border-ink-900 focus:outline-none"
        >
          <option value="">نظر کلی درباره کافه</option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-graphite-600">امتیاز</label>
        <StarRating value={rating} onChange={setRating} size={22} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-graphite-600">متن نظر</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none",
            errors.comment ? "border-red-400" : "border-graphite-200 focus:border-ink-900"
          )}
          placeholder="تجربه‌تان را بنویسید..."
        />
        {errors.comment && <p className="mt-1 text-[11px] text-red-500">{errors.comment}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-ink-900 py-2.5 text-sm font-semibold text-bone-50 transition-colors hover:bg-ink-800 disabled:opacity-60"
      >
        {submitting ? "در حال ثبت..." : "ارسال نظر"}
      </button>
    </form>
  );
}
