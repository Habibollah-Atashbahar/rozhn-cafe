"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { z } from "zod";
import { cn, formatToman } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { api, ApiError } from "@/lib/api";

const phoneSchema = z
  .string()
  .regex(/^09\d{9}$/, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");

export default function OrderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lines = useCartStore((s) => s.lines);
  const totalAmount = useCartStore((s) => s.totalAmount());
  const clear = useCartStore((s) => s.clear);
  const closeCart = useCartStore((s) => s.closeCart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function reset() {
    setName("");
    setPhone("");
    setErrors({});
    setSuccess(false);
    setServerError(null);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (name.trim().length < 2) newErrors.name = "نام خود را کامل وارد کنید";

    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success)
      newErrors.phone = phoneResult.error.issues[0]!.message;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await api.createOrder({
        customerName: name.trim(),
        phone,
        items: lines.map((l) => ({
          itemId: l.itemId,
          name: l.name,
          unitPrice: l.unitPrice,
          quantity: l.quantity,
          selectedOptions: l.selectedOptions,
          note: l.note,
        })),
        totalAmount,
      });
      setSuccess(true);
      clear();
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? "ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید."
          : "اتصال به سرور برقرار نشد. اتصال اینترنت را بررسی کنید."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-bone-50 p-6 shadow-2xl sm:max-w-md sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">
            {success ? "سفارش شما ثبت شد" : "تکمیل سفارش"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-graphite-100"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2
              size={48}
              className="text-ink-900"
              strokeWidth={1.4}
            />
            <p className="text-sm text-graphite-600">
              سفارش شما برای کافه ارسال شد. لطفاً منتظر بمانید تا آماده شود.
            </p>
            <button
              onClick={() => {
                handleClose();
                closeCart();
              }}
              className="mt-2 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-bone-50"
            >
              متوجه شدم
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="rounded-xl border border-graphite-200 bg-white/70 p-3">
              <p className="mb-2 text-xs font-medium text-graphite-500">
                خلاصه سفارش ({lines.length} قلم)
              </p>
              <ul className="max-h-28 space-y-1 overflow-y-auto text-xs text-graphite-600">
                {lines.map((l) => (
                  <li key={l.lineId} className="flex justify-between">
                    <span>
                      {l.name} × {l.quantity}
                    </span>
                    <span>
                      {formatToman(
                        (l.unitPrice +
                          l.selectedOptions.reduce(
                            (s, o) => s + o.priceDelta,
                            0
                          )) *
                          l.quantity
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-graphite-200 pt-2 text-sm font-bold text-ink-900">
                <span>جمع کل</span>
                <span>{formatToman(totalAmount)}</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-600">
                نام و نام خانوادگی
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none",
                  errors.name
                    ? "border-red-400"
                    : "border-graphite-200 focus:border-ink-900"
                )}
                placeholder="مثلاً رضا خانزهی"
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-600">
                شماره موبایل
              </label>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/[^0-9]/g, ""))
                }
                inputMode="numeric"
                maxLength={11}
                dir="ltr"
                className={cn(
                  "w-full rounded-lg border bg-white px-3 py-2.5 text-left text-sm focus:outline-none",
                  errors.phone
                    ? "border-red-400"
                    : "border-graphite-200 focus:border-ink-900"
                )}
                placeholder="09xxxxxxxxx"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>
              )}
            </div>

            {serverError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-full bg-ink-900 py-3 text-sm font-semibold text-bone-50 transition-colors hover:bg-ink-800 disabled:opacity-60"
            >
              {submitting ? "در حال ثبت..." : "ثبت نهایی سفارش"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
