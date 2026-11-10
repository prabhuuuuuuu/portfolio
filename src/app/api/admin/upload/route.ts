import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/admin/api";
import { BlogStoreError } from "@/lib/blog/errors";
import { slugify } from "@/lib/blog/format";
import { blogStore } from "@/lib/blog/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request);
  if ("error" in auth) return auth.error;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "The upload could not be read. Try a smaller image." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  }

  const slug = typeof form.get("slug") === "string" ? String(form.get("slug")).trim() : "";
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { ok: false, error: "Add a valid post slug before uploading images." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json(
      { ok: false, error: "Choose an image to upload." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const extension = IMAGE_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unsupported image type. Use JPEG, PNG, WebP, GIF, or AVIF.",
      },
      { status: 415, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image is larger than 4 MB after compression. Try a smaller file." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  }

  const originalName = file.name.replace(/\.[^.]+$/, "");
  const base = slugify(originalName).slice(0, 60) || "image";
  const filename = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}-${base}.${extension}`;

  try {
    const data = Buffer.from(await file.arrayBuffer());
    const result = await blogStore.uploadImage({ slug, filename, data });
    return NextResponse.json(
      { ok: true, ...result },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof BlogStoreError
        ? error.message
        : "The image could not be uploaded. Check the server logs.";
    const status = error instanceof BlogStoreError ? error.status : 500;
    console.error("[admin] Image upload failed", error);
    return NextResponse.json(
      { ok: false, error: message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
