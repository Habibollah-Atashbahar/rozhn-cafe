import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";
import { getAllMenuItems, saveAllMenuItems } from "@/lib/menuStore";
import type { CreateMenuItemPayload, MenuItem } from "@/types";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
  }
  const items = await getAllMenuItems();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const payload: CreateMenuItemPayload = await request.json();

  if (!payload.name?.trim() || !payload.categoryId) {
    return NextResponse.json(
      { message: "نام و دسته‌بندی محصول الزامی است" },
      { status: 400 }
    );
  }

  const items = await getAllMenuItems();

  const newItem: MenuItem = {
    id: `mi-${Date.now()}`,
    categoryId: payload.categoryId,
    name: payload.name.trim(),
    nameEn: payload.nameEn?.trim() || undefined,
    description: payload.description?.trim() || "",
    basePrice: Number(payload.basePrice) || 0,
    costPrice: payload.costPrice ? Number(payload.costPrice) : undefined,
    image: payload.image?.trim() || undefined,
    seasonal: Boolean(payload.seasonal),
    staffPick: Boolean(payload.staffPick),
    available: payload.available ?? true,
    optionGroups: payload.optionGroups?.length ? payload.optionGroups : undefined,
  };

  items.push(newItem);
  await saveAllMenuItems(items);

  return NextResponse.json(newItem, { status: 201 });
}
