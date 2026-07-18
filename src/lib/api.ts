// import type {
//   CreateOrderPayload,
//   MenuCategory,
//   MenuItem,
//   Order,
// } from "@/types";

// /**
//  * تمام ارتباط با بک‌اند از همین یک فایل عبور می‌کند.
//  * وقتی بک‌اند اصلی (Rust) جایگزین json-server شد، کافیست NEXT_PUBLIC_API_URL
//  * در .env عوض شود و در صورت نیاز شکل مسیرها اینجا اصلاح شود؛ بقیه‌ی
//  * اپلیکیشن هیچ تغییری نمی‌خواهد چون فقط با این توابع کار می‌کند.
//  */
// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

// class ApiError extends Error {
//   status: number;
//   constructor(message: string, status: number) {
//     super(message);
//     this.status = status;
//     this.name = "ApiError";
//   }
// }

// async function request<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       ...init?.headers,
//     },
//   });

//   if (!res.ok) {
//     const body = await res.text().catch(() => "");
//     throw new ApiError(
//       body || `درخواست به ${path} با خطا مواجه شد`,
//       res.status
//     );
//   }

//   if (res.status === 204) return undefined as T;
//   return res.json() as Promise<T>;
// }

// export const api = {
//   getCategories: () => request<MenuCategory[]>("/categories?_sort=order"),
//   getMenuItems: () => request<MenuItem[]>("/menuItems"),
//   createOrder: (payload: CreateOrderPayload) =>
//     request<Order>("/orders", {
//       method: "POST",
//       body: JSON.stringify({
//         ...payload,
//         status: "pending",
//         createdAt: new Date().toISOString(),
//       }),
//     }),
//   getOrders: () => request<Order[]>("/orders?_sort=createdAt&_order=desc"),
//   updateOrderStatus: (id: string, status: Order["status"]) =>
//     request<Order>(`/orders/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify({ status }),
//     }),
// };

// export { ApiError };

import type {
  CreateOrderPayload,
  MenuCategory,
  MenuItem,
  Order,
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
};

export { ApiError };
