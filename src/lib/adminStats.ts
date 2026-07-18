import type { MenuItem, Order } from "@/types";

function lineTotal(item: Order["items"][number]): number {
  const optionsTotal = item.selectedOptions.reduce((s, o) => s + o.priceDelta, 0);
  return (item.unitPrice + optionsTotal) * item.quantity;
}

function orderTotal(order: Order): number {
  return order.items.reduce((sum, i) => sum + lineTotal(i), 0);
}

function isSameDay(iso: string, date: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}

export function computeKpis(orders: Order[], menuItems: MenuItem[]) {
  const today = new Date();
  const todayOrders = orders.filter((o) => isSameDay(o.createdAt, today) && o.status !== "cancelled");

  const costByItemId = new Map(menuItems.map((m) => [m.id, m.costPrice ?? Math.round(m.basePrice * 0.42)]));

  const todayRevenue = todayOrders.reduce((sum, o) => sum + orderTotal(o), 0);
  const todayCost = todayOrders.reduce(
    (sum, o) =>
      sum +
      o.items.reduce((s, i) => s + (costByItemId.get(i.itemId) ?? i.unitPrice * 0.42) * i.quantity, 0),
    0
  );

  return {
    todayRevenue,
    todayOrdersCount: todayOrders.length,
    avgOrderValue: todayOrders.length ? Math.round(todayRevenue / todayOrders.length) : 0,
    estimatedProfit: Math.round(todayRevenue - todayCost),
    profitMargin: todayRevenue ? Math.round(((todayRevenue - todayCost) / todayRevenue) * 100) : 0,
  };
}

export function computeLast7DaysRevenue(orders: Order[]) {
  const days: { key: string; label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const revenue = orders
      .filter((o) => isSameDay(o.createdAt, d) && o.status !== "cancelled")
      .reduce((sum, o) => sum + orderTotal(o), 0);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("fa-IR", { weekday: "short" }),
      revenue,
    });
  }
  return days;
}

export function computeCategoryBreakdown(orders: Order[], menuItems: MenuItem[], categoryTitles: Record<string, string>) {
  const categoryByItemId = new Map(menuItems.map((m) => [m.id, m.categoryId]));
  const totals = new Map<string, number>();

  const last7 = new Date();
  last7.setDate(last7.getDate() - 6);
  last7.setHours(0, 0, 0, 0);

  orders
    .filter((o) => new Date(o.createdAt) >= last7 && o.status !== "cancelled")
    .forEach((o) => {
      o.items.forEach((i) => {
        const categoryId = categoryByItemId.get(i.itemId) ?? "other";
        totals.set(categoryId, (totals.get(categoryId) ?? 0) + lineTotal(i));
      });
    });

  return Array.from(totals.entries())
    .map(([categoryId, value]) => ({ name: categoryTitles[categoryId] ?? categoryId, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export { orderTotal };
