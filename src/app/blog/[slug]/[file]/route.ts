import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Fallback for images uploaded while the dev server is running. Next only
 * serves files that were present in `public/` when it started, so a freshly
 * uploaded image would otherwise 404 until a restart. Built deployments serve
 * the same path from `public/` directly, before this route is reached.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; file: string }> },
) {
  const { slug, file } = await params;

  if (
    !/^[a-z0-9-]+$/.test(slug) ||
    path.basename(file) !== file ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(file)
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const extension = file.split(".").pop()?.toLowerCase() ?? "";
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(
      path.join(process.cwd(), "public", "blog", slug, file),
    );
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(data.byteLength),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("[blog] Could not serve local image", error);
    }
    return new NextResponse("Not found", { status: 404 });
  }
}
