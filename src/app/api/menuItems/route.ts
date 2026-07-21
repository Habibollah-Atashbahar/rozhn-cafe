import { NextResponse } from "next/server";
import { getAllMenuItems } from "@/lib/menuStore";

export async function GET() {
  const items = await getAllMenuItems();
  return NextResponse.json(items);
}
