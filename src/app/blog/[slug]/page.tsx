import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { ShareLinks } from "@/components/blog/ShareLinks";
import {
  getAdjacentPosts,
  getPostBySlug,
  getPublishedPosts,
} from "@/lib/blog/content";
import { formatDateLong, formatDateShort } from "@/lib/blog/format";
import { compileMarkdown } from "@/lib/blog/markdown";
import { contactEmail, siteName, siteUrl } from "@/lib/portfolio-data";

export const dynamic = "force-static";
// Known slugs are prerendered at build. On-demand generation keeps newly created
// posts previewable in local production; Vercel still gets every slug at build
// time because publishing commits the markdown before the rebuild.
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Note not found" };

  const image = post.cover ?? "/opengraph-image";
  const fullTitle = `${post.title} — ${siteName}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: fullTitle,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: `${post.date}T00:00:00.000Z`,
      authors: ["Pranav Prashant Shewale"],
      tags: post.tags,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await compileMarkdown(post.content);
  const { newer, older } = getAdjacentPosts(post.slug);
  const coverIsExternal = Boolean(post.cover?.startsWith("http"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Pranav Prashant Shewale",
      url: siteUrl,
    },
    image: post.cover
      ? post.cover.startsWith("http")
        ? post.cover
        : `${siteUrl}${post.cover}`
      : `${siteUrl}/opengraph-image`,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <nav className="blog-post__crumbs" aria-label="Breadcrumb">
        <Link href="/blog" data-cursor="link">
          ← All notes
        </Link>
        <span aria-hidden>/</span>
        <span>{post.category}</span>
      </nav>

      <header className="blog-post__head">
        <div className="blog-post__meta">
          <span>{formatDateLong(post.date)}</span>
          <span className="blog-post__meta-sep" aria-hidden />
          <span>{post.category}</span>
          <span className="blog-post__meta-sep" aria-hidden />
          <span>{post.readingTime} min read</span>
        </div>
        <h1 className="blog-post__title">{post.title}</h1>
        <p className="blog-post__lede">{post.excerpt}</p>
      </header>

      {post.cover ? (
        <figure className="blog-post__cover">
          <div className="blog-post__cover-media">
            {coverIsExternal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover} alt={post.title} />
            ) : (
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 1400px"
              />
            )}
          </div>
          <figcaption>
            <span>{post.category}</span>
            <span>{formatDateShort(post.date)}</span>
          </figcaption>
        </figure>
      ) : null}

      <div className="blog-post__layout">
        <aside className="blog-post__rail" aria-label="Post details">
          <div className="blog-post__rail-item">
            <span className="label">Published</span>
            <time dateTime={post.date}>{formatDateShort(post.date)}</time>
          </div>
          <div className="blog-post__rail-item">
            <span className="label">Filed under</span>
            <span>{post.category}</span>
          </div>
          <div className="blog-post__rail-item">
            <span className="label">Read time</span>
            <span>{post.readingTime} min</span>
          </div>
          {post.tags.length ? (
            <div className="blog-post__rail-item">
              <span className="label">Tags</span>
              <div className="blog-post__rail-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="blog-post__rail-item">
            <span className="label">Share</span>
            <ShareLinks title={post.title} />
          </div>
        </aside>

        <MarkdownBody html={html} />
      </div>

      <footer className="blog-post__foot">
        <Link href="/blog" className="blog-post__back" data-cursor="link">
          ← Back to all notes
        </Link>
        <a href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Re: ${post.title}`)}`}>
          Reply by email
        </a>
      </footer>

      {newer || older ? (
        <nav className="blog-post__pager" aria-label="Adjacent posts">
          {newer ? (
            <Link href={`/blog/${newer.slug}`} className="blog-pager__link" data-cursor="view">
              <span className="label">Newer entry</span>
              <span className="blog-pager__title">{newer.title}</span>
              <span className="blog-pager__date">{formatDateShort(newer.date)}</span>
            </Link>
          ) : (
            <span />
          )}
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="blog-pager__link blog-pager__link--next"
              data-cursor="view"
            >
              <span className="label">Older entry</span>
              <span className="blog-pager__title">{older.title}</span>
              <span className="blog-pager__date">{formatDateShort(older.date)}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
