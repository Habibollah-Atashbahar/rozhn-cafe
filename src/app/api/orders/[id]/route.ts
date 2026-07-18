import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, saveAllOrders } from "@/lib/ordersStore";
import type { CreateOrderPayload, Order } from "@/types";

export async function POST(request: NextRequest) {
  const payload: CreateOrderPayload = await request.json();
  const orders = await getAllOrders();

  const newOrder: Order = {
    customerName: payload.customerName,
    phone: payload.phone,
    items: payload.items,
    totalAmount: payload.totalAmount,
    status: "pending",
    createdAt: new Date().toISOString(),
    id: `ord-${Date.now()}`,
  };

  orders.push(newOrder);
  await saveAllOrders(orders);

  return NextResponse.json(newOrder, { status: 201 });
}
