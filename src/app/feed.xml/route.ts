import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/blog/content";
import { siteDescription, siteName, siteUrl } from "@/lib/portfolio-data";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rfc822(date: string) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function GET() {
  const posts = getPublishedPosts();
  const lastBuildDate = posts[0] ? rfc822(posts[0].date) : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        `      <author>pranavprashantshewale@gmail.com (${escapeXml(siteName)})</author>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} — Notes</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
