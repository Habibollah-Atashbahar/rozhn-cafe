"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { cn, formatToman } from "@/lib/utils";
import OrderModal from "@/components/order/OrderModal";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const increment = useCartStore((s) => s.incrementLine);
  const decrement = useCartStore((s) => s.decrementLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const totalAmount = useCartStore((s) => s.totalAmount());

  const [orderModalOpen, setOrderModalOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-sm transition-opacity",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-bone-50 shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="سبد سفارش"
      >
        <div className="flex items-center justify-between border-b border-graphite-200 px-5 py-4">
          <h2 className="flex items-center gap-2 font-bold text-ink-900">
            <ShoppingBag size={18} /> سبد سفارش
          </h2>
          <button onClick={closeCart} className="rounded-full p-1.5 hover:bg-graphite-100" aria-label="بستن">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-graphite-400">
              <ShoppingBag size={32} strokeWidth={1.2} />
              <p className="text-sm">سبد سفارش شما خالی است</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => {
                const optionsTotal = line.selectedOptions.reduce((s, o) => s + o.priceDelta, 0);
                const lineTotal = (line.unitPrice + optionsTotal) * line.quantity;
                return (
                  <li key={line.lineId} className="flex gap-3 border-b border-graphite-100 pb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-ink-900">{line.name}</p>
                        <button
                          onClick={() => removeLine(line.lineId)}
                          className="text-graphite-400 hover:text-red-600"
                          aria-label="حذف از سبد"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      {line.selectedOptions.length > 0 && (
                        <p className="mt-0.5 text-[11px] text-graphite-500">
                          {line.selectedOptions.map((o) => o.choiceLabel).join(" · ")}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-graphite-200 px-1.5 py-1">
                          <button
                            onClick={() => decrement(line.lineId)}
                            className="flex h-5 w-5 items-center justify-center text-graphite-600"
                            aria-label="کم کردن"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-4 text-center text-xs font-medium">{line.quantity}</span>
                          <button
                            onClick={() => increment(line.lineId)}
                            className="flex h-5 w-5 items-center justify-center text-graphite-600"
                            aria-label="زیاد کردن"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-ink-800">{formatToman(lineTotal)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-graphite-200 px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-graphite-500">جمع کل</span>
              <span className="text-base font-bold text-ink-900">{formatToman(totalAmount)}</span>
            </div>
            <button
              onClick={() => setOrderModalOpen(true)}
              className="w-full rounded-full bg-ink-900 py-3 text-sm font-semibold text-bone-50 transition-colors hover:bg-ink-800"
            >
              ثبت سفارش
            </button>
          </div>
        )}
      </aside>

      <OrderModal open={orderModalOpen} onClose={() => setOrderModalOpen(false)} />
    </>
  );
}
