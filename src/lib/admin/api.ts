import { NextResponse } from "next/server";
import { assertSameOrigin, getAdminSession } from "./auth";

type Authorized = { session: { username: string; expiresAt: number } };
type Rejected = { error: NextResponse };

export async function authorizeAdmin(request: Request): Promise<Authorized | Rejected> {
  if (!assertSameOrigin(request)) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Invalid request origin." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const session = await getAdminSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Your session has expired. Sign in again." },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  return { session };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json(
    { ok: false, error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
