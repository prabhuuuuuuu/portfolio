export const BLOG_CATEGORY_SUGGESTIONS = [
  "Robotics",
  "Psychology",
  "Research",
  "Notes",
  "Life",
] as const;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function formatDateLong(value: string) {
  if (!isValidDateString(value)) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

/** Compact lab-style date: 2026.11.10 */
export function formatDateShort(value: string) {
  return isValidDateString(value) ? value.replaceAll("-", ".") : value;
}

export function readingTimeLabel(minutes: number) {
  return `${Math.max(1, minutes)} min read`;
}

export function categoryKey(category: string) {
  return slugify(category) || "uncategorised";
}
