"use client";

import useSWR from "swr";
import { api } from "@/lib/api";

export function useReviews(itemId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    ["reviews", itemId ?? "all"],
    () => api.getReviews(itemId),
    { revalidateOnFocus: false }
  );

  return {
    reviews: data ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

export function useAdminReviews() {
  const POLL_INTERVAL = Number(
    process.env.NEXT_PUBLIC_ADMIN_POLL_INTERVAL_MS ?? 15000
  );
  const { data, error, isLoading, mutate } = useSWR(
    "admin-reviews",
    api.getAdminReviews,
    { refreshInterval: POLL_INTERVAL, revalidateOnFocus: true }
  );

  return {
    reviews: data ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
