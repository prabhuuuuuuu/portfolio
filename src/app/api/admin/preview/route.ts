import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/admin/api";
import { compileMarkdown, rewriteMarkdownImageUrls } from "@/lib/blog/markdown";
import { getPreviewBaseUrl } from "@/lib/blog/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request);
  if ("error" in auth) return auth.error;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const content = typeof body?.content === "string" ? body.content : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

  if (content.length > 250_000) {
    return NextResponse.json(
      { ok: false, error: "Preview input is too large." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!content.trim()) {
    return NextResponse.json(
      { ok: true, html: "" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const html = await compileMarkdown(content);
    const base = /^[a-z0-9-]+$/.test(slug) ? getPreviewBaseUrl() : "";
    return NextResponse.json(
      { ok: true, html: rewriteMarkdownImageUrls(html, base) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[admin] Preview compile failed", error);
    return NextResponse.json(
      { ok: false, error: "The preview could not be rendered. Check the markdown syntax." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
