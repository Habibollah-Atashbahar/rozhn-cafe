import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, saveAllOrders } from "@/lib/ordersStore";
import type { CreateOrderPayload, Order } from "@/types";

export async function GET() {
  const orders = await getAllOrders();
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

export async function POST(request: NextRequest) {
  const payload: CreateOrderPayload = await request.json();
  const orders = await getAllOrders();

  const newOrder: Order = {
    ...payload,
    status: "pending",
    createdAt: new Date().toISOString(),
    id: `ord-${Date.now()}`,
  };

  orders.push(newOrder);
  await saveAllOrders(orders);

  return NextResponse.json(newOrder, { status: 201 });
}
