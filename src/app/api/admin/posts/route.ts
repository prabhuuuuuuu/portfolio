import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/admin/api";
import { BlogStoreError } from "@/lib/blog/errors";
import { blogStore } from "@/lib/blog/store";
import { validatePostInput } from "@/lib/blog/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request);
  if ("error" in auth) return auth.error;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const validated = validatePostInput(body);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: validated.error },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const input = validated.value;
  const isNew = body?.isNew === true;
  const originalSlug =
    typeof body?.originalSlug === "string" ? body.originalSlug.trim() : "";

  if (originalSlug && originalSlug !== input.slug) {
    return NextResponse.json(
      { ok: false, error: "A post's slug cannot be changed after it is created." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    if (isNew) {
      const existing = await blogStore.getPost(input.slug);
      if (existing) {
        return NextResponse.json(
          { ok: false, error: "A post with that slug already exists." },
          { status: 409, headers: { "Cache-Control": "no-store" } },
        );
      }
    }

    const result = await blogStore.savePost(input);

    if (result.mode === "local") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${input.slug}`);
      revalidatePath("/feed.xml");
      revalidatePath("/sitemap.xml");
    }

    return NextResponse.json(
      {
        ok: true,
        result,
        post: {
          slug: input.slug,
          title: input.title,
          draft: input.draft,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof BlogStoreError
        ? error.message
        : "The post could not be saved. Check the server logs.";
    const status = error instanceof BlogStoreError ? error.status : 500;
    console.error("[admin] Save post failed", error);
    return NextResponse.json(
      { ok: false, error: message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
