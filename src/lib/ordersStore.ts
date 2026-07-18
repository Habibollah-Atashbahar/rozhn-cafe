import { kv } from "@vercel/kv";
import type { Order } from "@/types";

const ORDERS_KEY = "orders";

export async function getAllOrders(): Promise<Order[]> {
  const orders = await kv.get<Order[]>(ORDERS_KEY);
  return orders ?? [];
}

export async function saveAllOrders(orders: Order[]): Promise<void> {
  await kv.set(ORDERS_KEY, orders);
}
