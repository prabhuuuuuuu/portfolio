import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/content";
import { siteUrl } from "@/lib/portfolio-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  const latestPost = posts[0]?.date;

  const pages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: latestPost ? new Date(`${latestPost}T00:00:00Z`) : undefined,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/experience`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestPost ? new Date(`${latestPost}T00:00:00Z`) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...pages, ...postEntries];
}
