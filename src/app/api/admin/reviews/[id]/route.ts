import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";
import { getAllReviews, saveAllReviews } from "@/lib/reviewsStore";

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
  const { approved }: { approved: boolean } = await request.json();

  const reviews = await getAllReviews();
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "نظر پیدا نشد" }, { status: 404 });
  }

  reviews[index] = { ...reviews[index]!, approved };
  await saveAllReviews(reviews);

  return NextResponse.json(reviews[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  const reviews = await getAllReviews();
  const filtered = reviews.filter((r) => r.id !== id);
  await saveAllReviews(filtered);

  return NextResponse.json({ ok: true });
}
