import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";
import { getAllMenuItems, saveAllMenuItems } from "@/lib/menuStore";
import type { UpdateMenuItemPayload } from "@/types";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  const updates: UpdateMenuItemPayload = await request.json();

  const items = await getAllMenuItems();
  const index = items.findIndex((i) => i.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
  }

  items[index] = { ...items[index]!, ...updates, id };
  await saveAllMenuItems(items);

  return NextResponse.json(items[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  const items = await getAllMenuItems();
  const filtered = items.filter((i) => i.id !== id);

  if (filtered.length === items.length) {
    return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
  }

  await saveAllMenuItems(filtered);
  return NextResponse.json({ ok: true });
}
