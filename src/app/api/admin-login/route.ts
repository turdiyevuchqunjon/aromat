import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, expectedAdminSessionValue, isValidAdminPassword } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const password = String(body.password || "");

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Parol noto'g'ri" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, await expectedAdminSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 kun
  });
  return res;
}
