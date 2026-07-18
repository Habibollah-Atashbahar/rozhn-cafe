import { Redis } from "@upstash/redis";
import type { Order } from "@/types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const ORDERS_KEY = "orders";

export async function getAllOrders(): Promise<Order[]> {
  const orders = await redis.get<Order[]>(ORDERS_KEY);
  return orders ?? [];
}

export async function saveAllOrders(orders: Order[]): Promise<void> {
  await redis.set(ORDERS_KEY, orders);
}
