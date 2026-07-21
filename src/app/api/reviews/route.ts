import { NextRequest, NextResponse } from "next/server";
import { getAllReviews, saveAllReviews } from "@/lib/reviewsStore";
import type { CreateReviewPayload, Review } from "@/types";

export async function GET(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get("itemId");
  const reviews = await getAllReviews();

  const approved = reviews.filter((r) => r.approved);
  const filtered = itemId ? approved.filter((r) => r.itemId === itemId) : approved;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(sorted);
}

export async function POST(request: NextRequest) {
  const payload: CreateReviewPayload = await request.json();

  if (!payload.customerName?.trim() || !payload.comment?.trim()) {
    return NextResponse.json(
      { message: "نام و متن نظر الزامی است" },
      { status: 400 }
    );
  }

  const rating = Math.min(5, Math.max(1, Math.round(payload.rating)));

  const reviews = await getAllReviews();

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    customerName: payload.customerName.trim(),
    itemId: payload.itemId || undefined,
    rating,
    comment: payload.comment.trim(),
    approved: false,
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);
  await saveAllReviews(reviews);

  return NextResponse.json(newReview, { status: 201 });
}
