import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/admin/api";
import { BlogStoreError } from "@/lib/blog/errors";
import { blogStore } from "@/lib/blog/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await authorizeAdmin(request);
  if ("error" in auth) return auth.error;

  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { ok: false, error: "Invalid post slug." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await blogStore.deletePost(slug);
    if (result.mode === "local") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/feed.xml");
      revalidatePath("/sitemap.xml");
    }

    return NextResponse.json(
      { ok: true, result },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof BlogStoreError
        ? error.message
        : "The post could not be deleted. Check the server logs.";
    const status = error instanceof BlogStoreError ? error.status : 500;
    console.error("[admin] Delete post failed", error);
    return NextResponse.json(
      { ok: false, error: message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
