import type { Experience } from "@/lib/portfolio-data";

/** "YYYY-MM" -> absolute month index. */
export function toMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

/** Current month as an absolute month index. */
export function nowMonth(now = new Date()) {
  return now.getFullYear() * 12 + now.getMonth();
}

/** Inclusive length of a role in months (open-ended roles run to now). */
export function durationMonths(item: Experience, now = nowMonth()) {
  const end = item.end ? toMonth(item.end) : now;
  return Math.max(1, end - toMonth(item.start) + 1);
}

export function formatDuration(months: number) {
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m === 0 ? `${y} yr` : `${y} yr ${m} mo`;
}
