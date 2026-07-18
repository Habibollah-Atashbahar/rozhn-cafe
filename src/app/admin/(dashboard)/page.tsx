"use client";

import { CircleDollarSign, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { useMenu } from "@/lib/hooks/useMenu";
import {
  computeCategoryBreakdown,
  computeKpis,
  computeLast7DaysRevenue,
} from "@/lib/adminStats";
import { formatToman, toPersianDigits } from "@/lib/utils";
import StatCard from "@/components/admin/StatCard";
import SalesBarChart from "@/components/admin/SalesBarChart";
import SalesPieChart from "@/components/admin/SalesPieChart";
import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminDashboardPage() {
  const { orders, isLoading, refresh, pollIntervalMs } = useOrders();
  const { categories, menuItems } = useMenu();

  const kpis = computeKpis(orders, menuItems);
  const dailyRevenue = computeLast7DaysRevenue(orders);
  const categoryTitles = Object.fromEntries(
    categories.map((c) => [c.id, c.title])
  );
  const categoryBreakdown = computeCategoryBreakdown(
    orders,
    menuItems,
    categoryTitles
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink-900">داشبورد فروش امروز</h1>
        <p className="text-[11px] text-graphite-400">
          بروزرسانی خودکار هر{" "}
          {toPersianDigits(Math.round(pollIntervalMs / 1000))} ثانیه
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CircleDollarSign}
          label="فروش امروز"
          value={formatToman(kpis.todayRevenue)}
        />
        <StatCard
          icon={Receipt}
          label="تعداد سفارش امروز"
          value={toPersianDigits(kpis.todayOrdersCount)}
        />
        <StatCard
          icon={TrendingUp}
          label="میانگین ارزش سفارش"
          value={formatToman(kpis.avgOrderValue)}
        />
        <StatCard
          icon={Wallet}
          label="سود تخمینی امروز"
          value={formatToman(kpis.estimatedProfit)}
          hint={`حاشیه سود تقریبی: ${toPersianDigits(kpis.profitMargin)}٪`}
          tone={kpis.estimatedProfit >= 0 ? "positive" : "negative"}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-card border border-graphite-200/70 bg-white/70 p-5 xl:col-span-3">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">
            روند فروش ۷ روز اخیر
          </h2>
          <SalesBarChart data={dailyRevenue} />
        </div>
        <div className="rounded-card border border-graphite-200/70 bg-white/70 p-5 xl:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">
            سهم فروش هر دسته (۷ روز اخیر)
          </h2>
          <SalesPieChart data={categoryBreakdown} />
        </div>
      </div>
      <div className="rounded-card border border-graphite-200/70 bg-white/70 p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">
          آخرین سفارش‌ها
        </h2>
        {isLoading ? (
          <p className="py-8 text-center text-xs text-graphite-400">
            در حال بارگذاری...
          </p>
        ) : (
          <OrdersTable orders={orders.slice(0, 6)} onChanged={refresh} />
        )}
      </div>
      <p className="rounded-card border border-dashed border-graphite-300 bg-bone-50 p-4 text-[11px] leading-6 text-graphite-500">
        در فایل db.json درست میشه
      </p>{" "}
    </div>
  );
}
