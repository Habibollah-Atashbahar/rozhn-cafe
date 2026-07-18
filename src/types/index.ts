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
  available: boolean;
  optionGroups?: MenuOptionGroup[];
};

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
  // birthDate: string;
  items: OrderItemPayload[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

export type CreateOrderPayload = Omit<Order, "id" | "createdAt" | "status">;
