"use client";

import useSWR from "swr";
import { api } from "@/lib/api";

const POLL_INTERVAL = Number(process.env.NEXT_PUBLIC_ADMIN_POLL_INTERVAL_MS ?? 15000);

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR("orders", api.getOrders, {
    refreshInterval: POLL_INTERVAL,
    revalidateOnFocus: true,
  });

  return {
    orders: data ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
    pollIntervalMs: POLL_INTERVAL,
  };
}
