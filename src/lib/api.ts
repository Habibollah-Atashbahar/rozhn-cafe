import type {
  CreateMenuItemPayload,
  CreateOrderPayload,
  CreateReviewPayload,
  MenuCategory,
  MenuItem,
  Order,
  Review,
  UpdateMenuItemPayload,
} from "@/types";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(
      body || `درخواست به ${path} با خطا مواجه شد`,
      res.status
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => request<MenuCategory[]>("/categories"),
  getMenuItems: () => request<MenuItem[]>("/menuItems"),
  createOrder: (payload: CreateOrderPayload) =>
    request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getOrders: () => request<Order[]>("/orders"),
  updateOrderStatus: (id: string, status: Order["status"]) =>
    request<Order>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getReviews: (itemId?: string) =>
    request<Review[]>(`/reviews${itemId ? `?itemId=${itemId}` : ""}`),
  createReview: (payload: CreateReviewPayload) =>
    request<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAdminReviews: () => request<Review[]>("/admin/reviews"),
  setReviewApproval: (id: string, approved: boolean) =>
    request<Review>(`/admin/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    }),
  deleteReview: (id: string) =>
    request<{ ok: boolean }>(`/admin/reviews/${id}`, { method: "DELETE" }),
  createMenuItem: (payload: CreateMenuItemPayload) =>
    request<MenuItem>("/admin/menu-items", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateMenuItem: (id: string, payload: UpdateMenuItemPayload) =>
    request<MenuItem>(`/admin/menu-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteMenuItem: (id: string) =>
    request<{ ok: boolean }>(`/admin/menu-items/${id}`, { method: "DELETE" }),
};

export { ApiError };
