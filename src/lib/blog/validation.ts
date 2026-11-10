import { isValidDateString, slugify } from "./format";
import { deriveExcerpt } from "./text";
import type { PostInput } from "./types";

type ValidationResult =
  | { ok: true; value: PostInput }
  | { ok: false; error: string };

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseTags(raw: unknown) {
  const values = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
      ? raw.split(",")
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

function normaliseCover(raw: unknown) {
  const cover = readString(raw);
  if (!cover) return undefined;
  if (cover.startsWith("//")) return undefined;
  if (cover.startsWith("/") || /^https?:\/\//i.test(cover)) return cover;
  return undefined;
}

export function validatePostInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid post payload." };
  }

  const body = input as Record<string, unknown>;
  const title = readString(body.title);
  if (!title) return { ok: false, error: "A title is required." };
  if (title.length > 200) return { ok: false, error: "Title must be 200 characters or fewer." };

  const slug = slugify(readString(body.slug) || title);
  if (!slug) {
    return { ok: false, error: "The slug needs at least one letter or number." };
  }

  const date = readString(body.date);
  if (!isValidDateString(date)) {
    return { ok: false, error: "Date must be a valid YYYY-MM-DD value." };
  }

  const category = readString(body.category).slice(0, 80) || "Notes";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) return { ok: false, error: "The post body cannot be empty." };
  if (content.length > 250_000) {
    return { ok: false, error: "The post body is too large. Keep it under 250,000 characters." };
  }

  const excerpt = (readString(body.excerpt) || deriveExcerpt(content)).slice(0, 500);
  if (!excerpt) {
    return { ok: false, error: "Add a short excerpt or some body text to derive one." };
  }

  return {
    ok: true,
    value: {
      title,
      slug,
      date,
      category,
      tags: normaliseTags(body.tags),
      excerpt,
      cover: normaliseCover(body.cover),
      content,
      draft: body.draft === true,
    },
  };
}
