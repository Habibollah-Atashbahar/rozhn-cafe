import { NextResponse } from "next/server";
import seed from "@/data/menu-seed.json";

export async function GET() {
  const categories = [...seed.categories].sort((a, b) => a.order - b.order);
  return NextResponse.json(categories);
}
