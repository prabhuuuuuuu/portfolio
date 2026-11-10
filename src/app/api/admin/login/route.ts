import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  assertSameOrigin,
  checkCredentials,
  clearLoginFailures,
  createSessionToken,
  getAdminConfigStatus,
  getClientIp,
  getRateLimitState,
  recordLoginFailure,
  wait,
} from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Invalid request origin." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const config = getAdminConfigStatus();
  if (!config.configured) {
    return NextResponse.json(
      {
        ok: false,
        error: `Admin is not configured. Missing: ${config.missing.join(", ")}.`,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const ip = getClientIp(request);
  const limit = getRateLimitState(ip);
  if (limit.limited) {
    return NextResponse.json(
      { ok: false, error: `Too many attempts. Try again in ${limit.retryAfter}s.` },
      {
        status: 429,
        headers: { "Cache-Control": "no-store", "Retry-After": String(limit.retryAfter) },
      },
    );
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password || username.length > 120 || password.length > 240) {
    recordLoginFailure(ip);
    await wait(350);
    return NextResponse.json(
      { ok: false, error: "Invalid username or password." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!checkCredentials(username, password)) {
    recordLoginFailure(ip);
    await wait(350);
    return NextResponse.json(
      { ok: false, error: "Invalid username or password." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  clearLoginFailures(ip);
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(ADMIN_COOKIE, createSessionToken(username), adminCookieOptions());
  return response;
}
