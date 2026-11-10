import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "./format";
import { deriveExcerpt, estimateReadingTime } from "./text";
import type { BlogPost, BlogPostMeta, PostInput } from "./types";

export const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");
export const BLOG_ASSET_DIR = path.join(process.cwd(), "public", "blog");

export function blogPostFile(slug: string) {
  return path.join(BLOG_CONTENT_DIR, `${slug}.md`);
}

export function blogAssetDir(slug: string) {
  return path.join(BLOG_ASSET_DIR, slug);
}

function normaliseDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = typeof value === "string" ? value.trim() : "";
  const match = raw.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) {
    const candidate = match[0];
    const parsed = new Date(`${candidate}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === candidate) {
      return candidate;
    }
  }
  return new Date().toISOString().slice(0, 10);
}

function normaliseTags(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  return Array.from(
    new Set(
      values
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean)
        .map((tag) => tag.slice(0, 40)),
    ),
  ).slice(0, 12);
}

export function parsePost(raw: string, fallbackSlug: string): BlogPost {
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const slug = slugify(String(data.slug ?? fallbackSlug)) || slugify(fallbackSlug);
  const content = parsed.content.trim();
  const title = String(data.title ?? "").trim() || slug;
  const excerpt =
    String(data.excerpt ?? "").trim() || deriveExcerpt(content) || "A note from the lab.";

  return {
    slug,
    title,
    date: normaliseDate(data.date),
    category: String(data.category ?? "Notes").trim() || "Notes",
    tags: normaliseTags(data.tags),
    excerpt: excerpt.slice(0, 500),
    cover: String(data.cover ?? "").trim() || undefined,
    draft: data.draft === true || data.draft === "true",
    readingTime: estimateReadingTime(content),
    content,
  };
}

export function serializePost(input: PostInput) {
  const data: Record<string, unknown> = {
    title: input.title,
    slug: input.slug,
    date: input.date,
    category: input.category,
    tags: input.tags,
    excerpt: input.excerpt,
    draft: input.draft,
  };
  if (input.cover) data.cover = input.cover;

  return matter.stringify(`${input.content.trim()}\n`, data);
}

export function readLocalPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return [];

  return fs
    .readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .flatMap((entry) => {
      const fallbackSlug = entry.name.replace(/\.md$/, "");
      try {
        const raw = fs.readFileSync(path.join(BLOG_CONTENT_DIR, entry.name), "utf8");
        return [parsePost(raw, fallbackSlug)];
      } catch (error) {
        console.error(`[blog] Could not read ${entry.name}`, error);
        return [];
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export function getPublishedPosts() {
  return readLocalPosts().filter((post) => !post.draft);
}

export function getPostBySlug(slug: string, options: { includeDrafts?: boolean } = {}) {
  const safeSlug = slugify(slug);
  if (!safeSlug || safeSlug !== slug) return null;
  const post = readLocalPosts().find((entry) => entry.slug === slug);
  if (!post) return null;
  if (post.draft && !options.includeDrafts) return null;
  return post;
}

export function getAdjacentPosts(slug: string) {
  const posts = getPublishedPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function toPostSummary(post: BlogPost): BlogPostMeta {
  const { slug, title, date, category, tags, excerpt, cover, draft, readingTime } = post;
  return { slug, title, date, category, tags, excerpt, cover, draft, readingTime };
}
