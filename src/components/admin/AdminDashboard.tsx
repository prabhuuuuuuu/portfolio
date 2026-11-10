"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDateShort } from "@/lib/blog/format";
import type { BlogPostMeta, StorageStatus } from "@/lib/blog/types";

export function AdminDashboard({
  posts,
  storage,
  storageLabel,
  loadError,
}: {
  posts: BlogPostMeta[];
  storage: StorageStatus;
  storageLabel: string;
  loadError?: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const published = posts.filter((post) => !post.draft).length;
  const drafts = posts.length - published;
  const latest = posts[0];

  async function handleDelete(post: BlogPostMeta) {
    const confirmed = window.confirm(
      `Delete “${post.title}”? This removes the markdown file and its uploaded images. It cannot be undone.`,
    );
    if (!confirmed) return;

    setError("");
    setNotice("");
    setDeleting(post.slug);

    try {
      const response = await fetch(`/api/admin/posts/${encodeURIComponent(post.slug)}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Delete failed.");
      }

      setNotice(`Deleted “${post.title}”.`);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-head">
        <div>
          <p className="label label--accent">CONTENT MANAGEMENT</p>
          <h1 className="admin-title">Blog entries</h1>
        </div>
        <Link href="/admin/editor" className="admin-btn admin-btn--primary">
          <span aria-hidden>+</span> New entry
        </Link>
      </header>

      {loadError ? (
        <div className="admin-alert admin-alert--error" role="alert">
          <strong>Could not load entries.</strong>
          <span>{loadError}</span>
        </div>
      ) : null}

      {error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="admin-alert admin-alert--ok" role="status">
          {notice}
        </div>
      ) : null}

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat__label">TOTAL</span>
          <strong className="admin-stat__value">{String(posts.length).padStart(2, "0")}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__label">LIVE</span>
          <strong className="admin-stat__value">{String(published).padStart(2, "0")}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__label">DRAFTS</span>
          <strong className="admin-stat__value">{String(drafts).padStart(2, "0")}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__label">LATEST</span>
          <strong className="admin-stat__value admin-stat__value--small">
            {latest ? formatDateShort(latest.date) : "—"}
          </strong>
        </div>
      </div>

      <div
        className={`admin-storage${
          storage.mode === "github" && !storage.configured ? " admin-storage--warn" : ""
        }`}
      >
        <div>
          <span className="admin-storage__label">
            STORAGE / {storage.mode === "github" ? "GITHUB" : "LOCAL FILESYSTEM"}
          </span>
          <strong className="admin-storage__value">{storageLabel}</strong>
          {storage.mode === "github" ? (
            <p>
              Publishing commits the markdown and images to GitHub. Vercel rebuilds the
              site automatically, usually in about one to two minutes.
            </p>
          ) : (
            <p>
              Entries are written to <code>content/blog</code> and images to{" "}
              <code>public/blog</code> on this machine. Configure GitHub storage for the
              deployed admin.
            </p>
          )}
        </div>
        {storage.mode === "github" && storage.configured ? (
          <a
            className="admin-storage__link"
            href={`https://github.com/${storage.owner}/${storage.repo}`}
            target="_blank"
            rel="noreferrer"
          >
            Repository ↗
          </a>
        ) : null}
      </div>

      {!storage.configured ? (
        <div className="admin-alert admin-alert--warn" role="alert">
          <strong>Saving is disabled until storage is configured.</strong>
          <span>Missing environment variables: {storage.missing.join(", ")}</span>
        </div>
      ) : null}

      <section className="admin-posts" aria-label="Blog entries">
        <div className="admin-posts__head" aria-hidden>
          <span>Status</span>
          <span>Entry</span>
          <span>Category</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {posts.length === 0 && !loadError ? (
          <div className="admin-posts__empty">
            <span className="blog-empty__code">{"// no entries"}</span>
            <h2>The log starts here.</h2>
            <p>Create the first note, save it as a draft, and publish when it is ready.</p>
            <Link href="/admin/editor" className="admin-btn admin-btn--primary">
              Write the first entry
            </Link>
          </div>
        ) : null}

        {posts.map((post) => (
          <article key={post.slug} className="admin-post-row">
            <div className="admin-post-row__status">
              <span className={`admin-status admin-status--${post.draft ? "draft" : "live"}`}>
                <i aria-hidden />
                {post.draft ? "DRAFT" : "LIVE"}
              </span>
            </div>

            <div className="admin-post-row__main">
              <Link href={`/admin/editor/${post.slug}`} className="admin-post-row__title">
                {post.title}
              </Link>
              <span className="admin-post-row__slug">/blog/{post.slug}</span>
            </div>

            <div className="admin-post-row__category">{post.category}</div>

            <div className="admin-post-row__date">
              <time dateTime={post.date}>{formatDateShort(post.date)}</time>
              <span>{post.readingTime} MIN</span>
            </div>

            <div className="admin-post-row__actions">
              {!post.draft ? (
                <Link href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                  View ↗
                </Link>
              ) : null}
              <Link href={`/admin/editor/${post.slug}`}>Edit</Link>
              <button
                type="button"
                className="admin-post-row__delete"
                onClick={() => handleDelete(post)}
                disabled={deleting === post.slug}
              >
                {deleting === post.slug ? "Deleting…" : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
