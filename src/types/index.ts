export type MenuOptionGroup = {
  title: string;
  required?: boolean;
  choices: {
    id: string;
    label: string;
    priceDelta: number;
  }[];
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  nameEn?: string;
  description?: string;
  basePrice: number;
  costPrice?: number;
  image?: string;
  seasonal?: boolean;
  staffPick?: boolean;
  available: boolean;
  optionGroups?: MenuOptionGroup[];
};

export type CreateMenuItemPayload = Omit<MenuItem, "id">;
export type UpdateMenuItemPayload = Partial<Omit<MenuItem, "id">>;

export type MenuCategory = {
  id: string;
  title: string;
  section: "hot" | "cold" | "food" | "hookah";
  order: number;
};

export type CartLineOption = {
  groupTitle: string;
  choiceLabel: string;
  priceDelta: number;
};

export type CartLine = {
  lineId: string;
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedOptions: CartLineOption[];
  note?: string;
};

export type OrderItemPayload = {
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedOptions: CartLineOption[];
  note?: string;
};

export type OrderStatus = "pending" | "preparing" | "done" | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  birthDate?: string; // تاریخ تولد به فرمت ISO (میلادی)، اختیاری
  tableNumber: string;
  items: OrderItemPayload[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

export type CreateOrderPayload = Omit<Order, "id" | "createdAt" | "status">;

export type Review = {
  id: string;
  customerName: string;
  itemId?: string; // خالی یعنی نظر کلی درباره کافه، نه یک محصول خاص
  rating: number; // ۱ تا ۵
  comment: string;
  approved: boolean;
  createdAt: string;
};

export type CreateReviewPayload = {
  customerName: string;
  itemId?: string;
  rating: number;
  comment: string;
};
