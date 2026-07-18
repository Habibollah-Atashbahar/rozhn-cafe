import { NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctPassword || password !== correctPassword) {
    return NextResponse.json(
      { message: "رمز عبور اشتباه است" },
      { status: 401 }
    );
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    // این پنل قرار است روی شبکه داخلی کافه (بدون HTTPS) استفاده شود.
    // اگر پشت یک دامنه با HTTPS واقعی دیپلوی شد، متغیر محیطی USE_HTTPS=true را ست کنید.
    secure: process.env.USE_HTTPS === "true",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
