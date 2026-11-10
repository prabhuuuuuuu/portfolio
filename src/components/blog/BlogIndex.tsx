"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { categoryKey, formatDateShort } from "@/lib/blog/format";
import type { BlogPostMeta } from "@/lib/blog/types";

export function BlogIndex({ posts }: { posts: BlogPostMeta[] }) {
  const [active, setActive] = useState("all");

  const categories = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();
    for (const post of posts) {
      const key = categoryKey(post.category);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { key, label: post.category, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [posts]);

  const filtered = useMemo(
    () =>
      active === "all"
        ? posts
        : posts.filter((post) => categoryKey(post.category) === active),
    [active, posts],
  );

  const latest = posts[0];

  return (
    <section className="blog-index">
      <header className="blog-index__head">
        <div>
          <p className="label label--accent">SEC 03 / WRITING</p>
          <h1 className="display blog-index__title">
            Notes from
            <br />
            <span className="thin">the lab</span>
          </h1>
        </div>

        <div className="blog-index__aside">
          <p className="blog-index__intro">
            Research notes, engineering logs, and things I am still trying to understand.
            Robotics, minds, and the occasional idea that will not leave me alone.
          </p>

          <div className="blog-index__readout telemetry">
            <span>
              <em>ENTRIES</em>
              <strong>{String(posts.length).padStart(2, "0")}</strong>
            </span>
            <span>
              <em>TOPICS</em>
              <strong>{String(categories.length).padStart(2, "0")}</strong>
            </span>
            <span>
              <em>LATEST</em>
              <strong>{latest ? formatDateShort(latest.date) : "—"}</strong>
            </span>
            <span>
              <em>STATUS</em>
              <strong className="blog-index__live">
                <i className="telemetry__dot" aria-hidden />
                WRITING
              </strong>
            </span>
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="blog-empty">
          <span className="blog-empty__code">{"// no published entries"}</span>
          <h2>The notebook is still warming up.</h2>
          <p>
            The first note is in the works. Research logs, half-formed ideas, and field
            notes will land here soon.
          </p>
        </div>
      ) : (
        <>
          <div className="blog-filter" role="group" aria-label="Filter posts by topic">
            <span className="label blog-filter__label">FILTER</span>
            <button
              type="button"
              className={`blog-filter__btn${active === "all" ? " is-active" : ""}`}
              onClick={() => setActive("all")}
              aria-pressed={active === "all"}
            >
              All <span className="blog-filter__count">{posts.length}</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                className={`blog-filter__btn${active === category.key ? " is-active" : ""}`}
                onClick={() => setActive(category.key)}
                aria-pressed={active === category.key}
              >
                {category.label} <span className="blog-filter__count">{category.count}</span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="blog-empty blog-empty--filter">
              <span className="blog-empty__code">{"// category empty"}</span>
              <h2>No entries here yet.</h2>
              <p>Try another topic, or read the full log.</p>
              <button type="button" onClick={() => setActive("all")} className="blog-empty__reset">
                Show all entries
              </button>
            </div>
          ) : (
            <div className="blog-list">
              {filtered.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-row"
                  data-cursor="view"
                  aria-label={`Read ${post.title}`}
                  style={{ "--row": index } as CSSProperties}
                >
                  <div className="blog-row__meta">
                    <span className="blog-row__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <time className="blog-row__date" dateTime={post.date}>
                      {formatDateShort(post.date)}
                    </time>
                  </div>

                  <div className="blog-row__copy">
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    {post.tags.length ? (
                      <ul className="blog-row__tags" aria-label="Tags">
                        {post.tags.slice(0, 4).map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="blog-row__thumb" aria-hidden>
                    {post.cover ? (
                      // Covers are repo-local and already compressed on upload.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.cover} alt="" loading="lazy" />
                    ) : (
                      <span className="blog-row__thumb-empty">{"//"}</span>
                    )}
                  </div>

                  <div className="blog-row__side">
                    <span className="blog-row__category">{post.category}</span>
                    <span className="blog-row__read">{post.readingTime} MIN</span>
                    <span className="blog-row__arrow" aria-hidden>
                      ↗
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <footer className="blog-index__foot">
            <span>More notes as the work happens.</span>
            <a href="/feed.xml">RSS ↗</a>
          </footer>
        </>
      )}
    </section>
  );
}
