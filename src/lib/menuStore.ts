import { Redis } from "@upstash/redis";
import type { MenuItem } from "@/types";
import seed from "@/data/menu-seed.json";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const MENU_ITEMS_KEY = "menuItems";

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const items = await redis.get<MenuItem[]>(MENU_ITEMS_KEY);
  if (items) return items;

  // اولین بار: از فایل seed اولیه پر می‌شود تا داده‌ی از قبل موجود از دست نرود
  const initial = seed.menuItems as MenuItem[];
  await redis.set(MENU_ITEMS_KEY, initial);
  return initial;
}

export async function saveAllMenuItems(items: MenuItem[]): Promise<void> {
  await redis.set(MENU_ITEMS_KEY, items);
}
