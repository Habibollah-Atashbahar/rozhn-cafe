"use client";

import useSWR from "swr";
import { api } from "@/lib/api";

export function useMenu() {
  const categories = useSWR("categories", api.getCategories, { revalidateOnFocus: false });
  const menuItems = useSWR("menuItems", api.getMenuItems, { revalidateOnFocus: false });

  return {
    categories: categories.data ?? [],
    menuItems: menuItems.data ?? [],
    isLoading: categories.isLoading || menuItems.isLoading,
    isError: categories.error || menuItems.error,
  };
}
