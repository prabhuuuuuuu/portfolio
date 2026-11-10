import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "portfolio_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;

type AdminConfig = {
  username: string;
  password: string;
  secret: string;
};

type AdminSession = {
  username: string;
  expiresAt: number;
};

const attempts = new Map<string, { count: number; resetAt: number }>();

function getAdminConfig(): AdminConfig {
  return {
    username: process.env.ADMIN_USERNAME?.trim() ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    secret: process.env.ADMIN_SESSION_SECRET?.trim() ?? "",
  };
}

export function getAdminConfigStatus() {
  const config = getAdminConfig();
  const missing: string[] = [];
  if (!config.username) missing.push("ADMIN_USERNAME");
  if (!config.password) missing.push("ADMIN_PASSWORD");
  if (!config.secret || config.secret.length < 16) missing.push("ADMIN_SESSION_SECRET");

  return {
    configured: missing.length === 0,
    missing,
  };
}

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest();
}

function constantTimeEqual(a: string, b: string) {
  return crypto.timingSafeEqual(hash(a), hash(b));
}

export function checkCredentials(username: string, password: string) {
  const config = getAdminConfig();
  if (!config.username || !config.password) return false;
  const userOk = constantTimeEqual(username, config.username);
  const passOk = constantTimeEqual(password, config.password);
  return userOk && passOk;
}

function sign(payload: string) {
  const { secret } = getAdminConfig();
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(username: string) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: username,
      exp: Date.now() + SESSION_TTL_MS,
      v: 1,
    }),
    "utf8",
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  const { secret } = getAdminConfig();
  if (!secret || secret.length < 16) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!constantTimeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: unknown;
      exp?: unknown;
      v?: unknown;
    };
    if (data.v !== 1 || typeof data.sub !== "string" || typeof data.exp !== "number") {
      return null;
    }
    if (data.exp <= Date.now()) return null;
    return { username: data.sub, expiresAt: data.exp };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function getRateLimitState(key: string) {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || record.resetAt <= now) {
    attempts.delete(key);
    return { limited: false, retryAfter: 0 };
  }
  return {
    limited: record.count >= MAX_ATTEMPTS,
    retryAfter: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
  };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
  } else {
    record.count += 1;
  }

  if (attempts.size > 1000) {
    for (const [entryKey, entry] of attempts) {
      if (entry.resetAt <= now) attempts.delete(entryKey);
    }
  }
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
