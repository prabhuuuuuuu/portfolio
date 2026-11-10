import { NextResponse } from "next/server";
import { ADMIN_COOKIE, assertSameOrigin } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Invalid request origin." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
