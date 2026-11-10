import fs from "node:fs/promises";
import path from "node:path";
import {
  BLOG_ASSET_DIR,
  BLOG_CONTENT_DIR,
  blogAssetDir,
  blogPostFile,
  parsePost,
  readLocalPosts,
  serializePost,
} from "./content";
import { BlogStoreError } from "./errors";
import type { BlogPost, DeleteResult, PostInput, SaveResult, UploadResult } from "./types";

function assertWritable() {
  if (process.env.VERCEL) {
    throw new BlogStoreError(
      "Local blog storage is disabled on Vercel. Configure GITHUB_TOKEN to publish from the deployed site.",
      503,
    );
  }
}

function safeSlug(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new BlogStoreError("Invalid post slug.", 400);
  }
  return slug;
}

export async function listLocalAdminPosts(): Promise<BlogPost[]> {
  return readLocalPosts();
}

export async function getLocalAdminPost(slug: string): Promise<BlogPost | null> {
  safeSlug(slug);
  try {
    const raw = await fs.readFile(blogPostFile(slug), "utf8");
    return parsePost(raw, slug);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function saveLocalPost(input: PostInput): Promise<SaveResult> {
  assertWritable();
  const slug = safeSlug(input.slug);
  await fs.mkdir(BLOG_CONTENT_DIR, { recursive: true });
  await fs.writeFile(blogPostFile(slug), serializePost({ ...input, slug }), "utf8");
  return {
    mode: "local",
    liveUrl: input.draft ? null : `/blog/${slug}`,
  };
}

export async function deleteLocalPost(slug: string): Promise<DeleteResult> {
  assertWritable();
  const safe = safeSlug(slug);

  try {
    await fs.unlink(blogPostFile(safe));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  await fs.rm(blogAssetDir(safe), { recursive: true, force: true });
  return { mode: "local" };
}

export async function uploadLocalImage(input: {
  slug: string;
  filename: string;
  data: Buffer;
}): Promise<UploadResult> {
  assertWritable();
  const slug = safeSlug(input.slug);
  const filename = path.basename(input.filename);
  if (!filename || filename !== input.filename) {
    throw new BlogStoreError("Invalid image filename.", 400);
  }

  const dir = path.join(BLOG_ASSET_DIR, slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), input.data);

  const publicPath = `/blog/${slug}/${filename}`;
  return {
    mode: "local",
    path: publicPath,
    previewUrl: publicPath,
  };
}
