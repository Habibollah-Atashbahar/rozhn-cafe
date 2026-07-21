"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp, Cake } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { formatToman, toPersianDigits } from "@/lib/utils";
import { orderTotal } from "@/lib/adminStats";
import { api } from "@/lib/api";
import OrderStatusBadge from "./OrderStatusBadge";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "preparing",
  "done",
  "cancelled",
];

function itemCount(order: Order) {
  return order.items.reduce((sum, i) => sum + i.quantity, 0);
}

function isBirthdayToday(birthDate?: string) {
  if (!birthDate) return false;
  const b = new Date(birthDate);
  const now = new Date();
  return b.getMonth() === now.getMonth() && b.getDate() === now.getDate();
}

export default function OrdersTable({
  orders,
  onChanged,
}: {
  orders: Order[];
  onChanged?: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: OrderStatus) {
    await api.updateOrderStatus(id, status);
    onChanged?.();
  }

  if (orders.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-graphite-400">
        هنوز سفارشی ثبت نشده است
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] table-fixed text-sm">
        <thead>
          <tr className="border-b border-graphite-200 text-right text-xs text-graphite-500">
            <th className="w-[16%] py-3 font-medium">مشتری</th>
            <th className="w-[14%] py-3 font-medium">موبایل</th>
            <th className="w-[8%] py-3 text-center font-medium">میز</th>
            <th className="w-[10%] py-3 text-center font-medium">
              تعداد اقلام
            </th>
            <th className="w-[14%] py-3 font-medium">مبلغ</th>
            <th className="w-[8%] py-3 font-medium">زمان</th>
            <th className="w-[20%] py-3 font-medium">وضعیت</th>
            <th className="w-[6%] py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isOpen = expandedId === order.id;
            return (
              <Fragment key={order.id}>
                <tr className="border-b border-graphite-100 last:border-none">
                  <td className="truncate py-3 font-medium text-ink-900">
                    <span className="inline-flex items-center gap-1">
                      {order.customerName}
                      {isBirthdayToday(order.birthDate) && (
                        <Cake
                          size={14}
                          className="text-pink-500"
                          aria-label="تولد امروز مشتری است"
                        />
                      )}
                    </span>
                  </td>
                  <td dir="ltr" className="py-3 text-left text-graphite-600">
                    {order.phone}
                  </td>
                  <td className="py-3 text-center font-medium text-ink-800">
                    {toPersianDigits(order.tableNumber)}
                  </td>
                  <td className="py-3 text-center text-graphite-600">
                    {toPersianDigits(itemCount(order))}
                  </td>
                  <td className="whitespace-nowrap py-3 font-semibold text-ink-800">
                    {formatToman(orderTotal(order))}
                  </td>
                  <td className="whitespace-nowrap py-3 text-xs text-graphite-500">
                    {new Date(order.createdAt).toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="w-full rounded-lg border border-graphite-200 bg-white px-2 py-1 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s === "pending" && "در انتظار"}
                          {s === "preparing" && "در حال آماده‌سازی"}
                          {s === "done" && "تحویل شده"}
                          {s === "cancelled" && "لغو شده"}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => setExpandedId(isOpen ? null : order.id)}
                      className="rounded-full p-1.5 hover:bg-graphite-100"
                      aria-label="جزئیات سفارش"
                    >
                      {isOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </td>
                </tr>
                {isOpen && (
                  <tr className="bg-bone-100/60">
                    <td colSpan={8} className="px-3 py-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="text-xs text-graphite-500">
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <ul className="space-y-1 text-xs text-graphite-700">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>
                                {item.name} × {toPersianDigits(item.quantity)}
                                {item.selectedOptions.length > 0 && (
                                  <span className="text-graphite-400">
                                    {" "}
                                    (
                                    {item.selectedOptions
                                      .map((o) => o.choiceLabel)
                                      .join("، ")}
                                    )
                                  </span>
                                )}
                              </span>
                              <span>
                                {formatToman(
                                  (item.unitPrice +
                                    item.selectedOptions.reduce(
                                      (s, o) => s + o.priceDelta,
                                      0
                                    )) *
                                    item.quantity
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
