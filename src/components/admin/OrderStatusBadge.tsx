import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار",
  preparing: "در حال آماده‌سازی",
  done: "تحویل شده",
  cancelled: "لغو شده",
};

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  preparing: "bg-blue-50 text-blue-700 border-blue-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
