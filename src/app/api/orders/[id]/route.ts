import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, saveAllOrders } from "@/lib/ordersStore";
import type { OrderStatus } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status }: { status: OrderStatus } = await request.json();

  const orders = await getAllOrders();
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "سفارش پیدا نشد" }, { status: 404 });
  }

  orders[index] = { ...orders[index]!, status };
  await saveAllOrders(orders);

  return NextResponse.json(orders[index]);
}
