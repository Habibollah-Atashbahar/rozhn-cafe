import { NextResponse } from "next/server";
import seed from "@/data/menu-seed.json";

export async function GET() {
  return NextResponse.json(seed.menuItems);
}
