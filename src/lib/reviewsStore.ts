import { Redis } from "@upstash/redis";
import type { Review } from "@/types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const REVIEWS_KEY = "reviews";

export async function getAllReviews(): Promise<Review[]> {
  const reviews = await redis.get<Review[]>(REVIEWS_KEY);
  return reviews ?? [];
}

export async function saveAllReviews(reviews: Review[]): Promise<void> {
  await redis.set(REVIEWS_KEY, reviews);
}
