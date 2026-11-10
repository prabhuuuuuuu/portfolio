import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getPublishedPosts, toPostSummary } from "@/lib/blog/content";
import { pageMetadata } from "@/lib/portfolio-data";

export const dynamic = "force-static";

const base = pageMetadata(
  "Blog",
  "Research notes and engineering logs from Pranav Prashant Shewale on robotics, physical AI, psychology, and whatever else is worth writing down.",
  "/blog",
);

export const metadata: Metadata = {
  ...base,
  alternates: {
    ...base.alternates,
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function BlogPage() {
  const posts = getPublishedPosts().map(toPostSummary);
  return <BlogIndex posts={posts} />;
}
