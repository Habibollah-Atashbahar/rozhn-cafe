"use client";

import { useState } from "react";
import { useOrders } from "@/lib/hooks/useOrders";
import { toPersianDigits } from "@/lib/utils";
import OrdersTable from "@/components/admin/OrdersTable";
import type { OrderStatus } from "@/types";

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "preparing", label: "در حال آماده‌سازی" },
  { value: "done", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function AdminOrdersPage() {
  const { orders, isLoading, refresh, pollIntervalMs } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-ink-900">
          همه سفارش‌ها <span className="text-graphite-400">({toPersianDigits(filtered.length)})</span>
        </h1>
        <p className="text-[11px] text-graphite-400">
          بروزرسانی خودکار هر {toPersianDigits(Math.round(pollIntervalMs / 1000))} ثانیه
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
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
          <OrdersTable orders={filtered} onChanged={refresh} />
        )}
      </div>
    </div>
  );
}
