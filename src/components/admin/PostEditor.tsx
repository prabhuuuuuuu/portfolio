"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { BLOG_CATEGORY_SUGGESTIONS, slugify } from "@/lib/blog/format";
import type { BlogPost, StoreMode } from "@/lib/blog/types";

type PreviewState = "idle" | "loading" | "ready" | "error";

function localToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function previewUrlFor(path: string | undefined, base: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (!base) return path;
  return `${base}${path}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the image."))),
      type,
      quality,
    );
  });
}

async function prepareImage(file: File) {
  const allowed = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ]);

  if (!allowed.has(file.type)) {
    throw new Error("Unsupported image. Use JPEG, PNG, WebP, GIF, or AVIF.");
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error("Image is larger than 20 MB. Resize it before uploading.");
  }

  if (file.type === "image/gif") {
    if (file.size > 3.5 * 1024 * 1024) {
      throw new Error("GIFs must be under 3.5 MB. Use a shorter clip or a still image.");
    }
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    return { blob: file, filename: `${base}.gif` };
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This image could not be read. Try JPEG, PNG, or WebP.");
  }

  const maxDimension = 2400;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Image compression is not available in this browser.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob = await canvasToBlob(canvas, "image/webp", 0.86);
  let quality = 0.86;

  if (blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, "image/jpeg", 0.85);
    quality = 0.85;
  }

  while (blob.size > 3.2 * 1024 * 1024 && quality > 0.5) {
    quality = Math.max(0.5, quality - 0.08);
    blob = await canvasToBlob(canvas, blob.type, quality);
  }

  if (blob.size > 3.6 * 1024 * 1024) {
    throw new Error("Image is still too large after compression. Try a smaller image.");
  }

  const extension =
    blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";

  return { blob, filename: `${base}.${extension}` };
}

export function PostEditor({
  mode,
  initialPost,
  previewBase,
  storageMode,
}: {
  mode: "create" | "edit";
  initialPost?: BlogPost;
  previewBase: string;
  storageMode: StoreMode;
}) {
  const [isNew, setIsNew] = useState(mode === "create");
  const [savedSlug, setSavedSlug] = useState(initialPost?.slug ?? "");
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost));
  const [date, setDate] = useState(initialPost?.date ?? localToday());
  const [category, setCategory] = useState(initialPost?.category ?? "Notes");
  const [tags, setTags] = useState(initialPost?.tags.join(", ") ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [cover, setCover] = useState(initialPost?.cover ?? "");
  const [coverPreview, setCoverPreview] = useState(
    previewUrlFor(initialPost?.cover, previewBase),
  );
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [draft, setDraft] = useState(initialPost?.draft ?? true);

  const [previewHtml, setPreviewHtml] = useState("");
  const [previewState, setPreviewState] = useState<PreviewState>("idle");
  const [previewError, setPreviewError] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const [coverDrag, setCoverDrag] = useState(false);
  const [contentDrag, setContentDrag] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(() => {
    const text = content.trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

  useEffect(() => {
    if (!content.trim()) {
      setPreviewHtml("");
      setPreviewState("idle");
      setPreviewError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setPreviewState("loading");
      setPreviewError("");

      void (async () => {
        try {
          const response = await fetch("/api/admin/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, slug }),
            signal: controller.signal,
          });
          const data = (await response.json().catch(() => null)) as
            | { ok?: boolean; html?: string; error?: string }
            | null;

          if (!response.ok || !data?.ok) {
            throw new Error(data?.error ?? "Preview failed.");
          }

          setPreviewHtml(String(data.html ?? ""));
          setPreviewState("ready");
        } catch (previewFailure) {
          if (controller.signal.aborted) return;
          setPreviewState("error");
          setPreviewError(
            previewFailure instanceof Error ? previewFailure.message : "Preview failed.",
          );
        }
      })();
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [content, slug]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function touch() {
    setDirty(true);
    setNotice("");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched && isNew) setSlug(slugify(value));
    touch();
  }

  function handleSlugChange(value: string) {
    setSlug(slugify(value));
    setSlugTouched(true);
    touch();
  }

  function setContentAndDirty(next: string) {
    setContent(next);
    touch();
  }

  function insertAtCursor(text: string) {
    const element = textareaRef.current;
    if (!element) {
      setContentAndDirty(content + text);
      return;
    }

    const start = element.selectionStart ?? content.length;
    const end = element.selectionEnd ?? content.length;
    const next = content.slice(0, start) + text + content.slice(end);
    setContentAndDirty(next);

    requestAnimationFrame(() => {
      element.focus();
      const position = start + text.length;
      element.setSelectionRange(position, position);
    });
  }

  function replaceSelection(prefix: string, suffix: string, placeholder: string) {
    const element = textareaRef.current;
    if (!element) {
      setContentAndDirty(content + prefix + placeholder + suffix);
      return;
    }

    const start = element.selectionStart ?? content.length;
    const end = element.selectionEnd ?? content.length;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + prefix + selected + suffix + content.slice(end);
    setContentAndDirty(next);

    requestAnimationFrame(() => {
      element.focus();
      const selectionStart = start + prefix.length;
      element.setSelectionRange(selectionStart, selectionStart + selected.length);
    });
  }

  function transformLines(transform: (line: string, index: number) => string) {
    const element = textareaRef.current;
    if (!element) return;

    const start = element.selectionStart ?? 0;
    const end = element.selectionEnd ?? 0;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = content.indexOf("\n", end);
    const sliceEnd = lineEnd === -1 ? content.length : lineEnd;
    const block = content.slice(lineStart, sliceEnd);
    const transformed = block.split("\n").map(transform).join("\n");
    const next = content.slice(0, lineStart) + transformed + content.slice(sliceEnd);
    setContentAndDirty(next);

    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(lineStart, lineStart + transformed.length);
    });
  }

  function insertLink() {
    const element = textareaRef.current;
    const selected =
      element && element.selectionStart !== element.selectionEnd
        ? content.slice(element.selectionStart, element.selectionEnd)
        : "";
    replaceSelection("[", "](https://)", selected || "link text");
  }

  async function uploadImage(file: File) {
    if (!slug.trim() || !/^[a-z0-9-]+$/.test(slug)) {
      setError("Add a title or slug before uploading images.");
      return null;
    }

    setError("");
    setNotice("");
    setUploading(true);

    try {
      const prepared = await prepareImage(file);
      const form = new FormData();
      form.append("slug", slug);
      form.append("file", prepared.blob, prepared.filename);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; path?: string; previewUrl?: string; error?: string }
        | null;

      if (!response.ok || !data?.ok || !data.path) {
        throw new Error(data?.error ?? "Upload failed.");
      }

      return {
        path: data.path,
        previewUrl: data.previewUrl ?? data.path,
      };
    } catch (uploadFailure) {
      setError(uploadFailure instanceof Error ? uploadFailure.message : "Upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleCoverFile(file?: File) {
    if (!file || uploading) return;
    const uploaded = await uploadImage(file);
    if (!uploaded) return;
    setCover(uploaded.path);
    setCoverPreview(uploaded.previewUrl);
    touch();
  }

  async function insertContentImage(file: File) {
    if (uploading) return;
    const uploaded = await uploadImage(file);
    if (!uploaded) return;

    const alt =
      file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim() || "image";
    insertAtCursor(`\n![${alt}](${uploaded.path})\n`);
  }

  function handleContentPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData?.items ?? [])
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));

    if (!files.length) return;
    event.preventDefault();

    void (async () => {
      for (const file of files) {
        await insertContentImage(file);
      }
    })();
  }

  function handleContentDrop(event: React.DragEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.dataTransfer.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!files.length) return;
    event.preventDefault();
    setContentDrag(false);

    void (async () => {
      for (const file of files) {
        await insertContentImage(file);
      }
    })();
  }

  function handleContentKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      insertAtCursor("  ");
      return;
    }

    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();

    if (key === "b") {
      event.preventDefault();
      replaceSelection("**", "**", "bold text");
    } else if (key === "i") {
      event.preventDefault();
      replaceSelection("*", "*", "italic text");
    } else if (key === "k") {
      event.preventDefault();
      insertLink();
    }
  }

  async function handleSave(nextDraft: boolean) {
    if (saving || uploading) return;

    const cleanTitle = title.trim();
    const cleanSlug = slug.trim();
    const cleanContent = content.trim();

    if (!cleanTitle) {
      setError("Add a title before saving.");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      setError("The slug can only use lowercase letters, numbers, and hyphens.");
      return;
    }
    if (!cleanContent) {
      setError("The post body cannot be empty.");
      return;
    }
    if (!date) {
      setError("Add a publish date.");
      return;
    }

    setError("");
    setNotice("");
    setCommitUrl("");
    setLiveUrl("");
    setSaving(true);

    const wasDraft = draft;
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          slug: cleanSlug,
          date,
          category,
          tags: tagList,
          excerpt,
          cover: cover || undefined,
          content,
          draft: nextDraft,
          isNew,
          originalSlug: savedSlug || undefined,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            error?: string;
            result?: { liveUrl?: string | null; commitUrl?: string };
          }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Save failed.");
      }

      setDraft(nextDraft);
      setDirty(false);
      setSavedSlug(cleanSlug);
      setSlugTouched(true);
      setLiveUrl(
        typeof data.result?.liveUrl === "string" ? data.result.liveUrl : "",
      );
      setCommitUrl(
        typeof data.result?.commitUrl === "string" ? data.result.commitUrl : "",
      );

      let message: string;
      if (nextDraft) {
        message = wasDraft ? "Draft saved." : "Post moved to drafts.";
      } else {
        message = wasDraft ? "Post published." : "Published changes saved.";
      }
      setNotice(message);

      if (isNew) {
        setIsNew(false);
        window.history.replaceState(null, "", `/admin/editor/${cleanSlug}`);
      }
    } catch (saveFailure) {
      setError(saveFailure instanceof Error ? saveFailure.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!savedSlug) return;
    const confirmed = window.confirm(
      `Delete “${title || savedSlug}”? This removes the markdown file and its uploaded images. It cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/posts/${encodeURIComponent(savedSlug)}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Delete failed.");
      }

      window.location.assign("/admin");
    } catch (deleteFailure) {
      setError(deleteFailure instanceof Error ? deleteFailure.message : "Delete failed.");
      setDeleting(false);
    }
  }

  const previewLabel =
    previewState === "loading"
      ? "COMPILING"
      : previewState === "error"
        ? "ERROR"
        : previewState === "ready"
          ? "READY"
          : "WAITING";

  return (
    <div className="admin-editor">
      <div className="admin-editor__bar">
        <div className="admin-editor__bar-left">
          <Link href="/admin" className="admin-back">
            ← Entries
          </Link>
          <span className="admin-editor__divider" aria-hidden />
          <span className="admin-editor__label">
            {isNew ? "NEW ENTRY" : `EDIT / ${savedSlug || slug}`}
          </span>
          <span className={`admin-status admin-status--${draft ? "draft" : "live"}`}>
            <i aria-hidden />
            {draft ? "DRAFT" : "LIVE"}
          </span>
          {dirty ? <span className="admin-editor__dirty">UNSAVED</span> : null}
        </div>

        <div className="admin-editor__bar-actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => void handleSave(true)}
            disabled={saving || uploading}
          >
            {draft ? "Save draft" : "Move to drafts"}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={() => void handleSave(false)}
            disabled={saving || uploading}
          >
            {saving ? "Saving…" : draft ? "Publish" : "Update published"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="admin-alert admin-alert--ok" role="status">
          <div>
            <strong>{notice}</strong>
            {storageMode === "github" && !draft ? (
              <span>
                {" "}
                Committed to GitHub. Vercel is rebuilding; the public page should update
                in about a minute.
              </span>
            ) : null}
          </div>
          <div className="admin-alert__actions">
            {commitUrl ? (
              <a href={commitUrl} target="_blank" rel="noreferrer">
                View commit ↗
              </a>
            ) : null}
            {!draft && liveUrl ? (
              <a href={liveUrl} target="_blank" rel="noreferrer">
                Open post ↗
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="admin-editor__grid">
        <div className="admin-editor__main">
          <section className="admin-panel">
            <div className="admin-panel__head">
              <span className="admin-panel__label">ENTRY DETAILS</span>
              <span className="admin-hint">
                {isNew ? "Slug locks after the first save." : "Slug is locked."}
              </span>
            </div>

            <div className="admin-meta-grid">
              <label className="admin-field admin-span-12">
                <span className="admin-field__label">Title</span>
                <input
                  className="admin-title-input"
                  value={title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="What did you learn?"
                  maxLength={200}
                  autoFocus={isNew}
                />
              </label>

              <label className="admin-field admin-span-6">
                <span className="admin-field__label">Slug</span>
                <span className="admin-input-prefix">
                  <span>/blog/</span>
                  <input
                    className="admin-input"
                    value={slug}
                    onChange={(event) => handleSlugChange(event.target.value)}
                    placeholder="my-new-note"
                    maxLength={80}
                    disabled={!isNew}
                  />
                </span>
              </label>

              <label className="admin-field admin-span-3">
                <span className="admin-field__label">Date</span>
                <input
                  className="admin-input"
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    touch();
                  }}
                  required
                />
              </label>

              <label className="admin-field admin-span-3">
                <span className="admin-field__label">Category</span>
                <input
                  className="admin-input"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    touch();
                  }}
                  list="blog-category-options"
                  placeholder="Robotics"
                  maxLength={80}
                />
                <datalist id="blog-category-options">
                  {BLOG_CATEGORY_SUGGESTIONS.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </label>

              <label className="admin-field admin-span-12">
                <span className="admin-field__label">
                  Tags <em>comma separated</em>
                </span>
                <input
                  className="admin-input"
                  value={tags}
                  onChange={(event) => {
                    setTags(event.target.value);
                    touch();
                  }}
                  placeholder="robotics, sim-to-real, notes"
                />
              </label>

              <label className="admin-field admin-span-12">
                <span className="admin-field__label">
                  Excerpt <em>optional — generated from the body if blank</em>
                </span>
                <textarea
                  className="admin-textarea"
                  value={excerpt}
                  onChange={(event) => {
                    setExcerpt(event.target.value);
                    touch();
                  }}
                  rows={3}
                  maxLength={500}
                  placeholder="One or two sentences shown on the blog index and in previews."
                />
              </label>

              <div className="admin-field admin-span-12">
                <span className="admin-field__label">
                  Cover image <em>optional</em>
                </span>
                <div
                  className={`admin-cover${coverDrag ? " is-over" : ""}${
                    uploading ? " is-busy" : ""
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setCoverDrag(true);
                  }}
                  onDragLeave={() => setCoverDrag(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setCoverDrag(false);
                    void handleCoverFile(event.dataTransfer.files?.[0]);
                  }}
                >
                  {coverPreview ? (
                    <div className="admin-cover__preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverPreview} alt="Cover preview" />
                      <div className="admin-cover__overlay">
                        <button
                          type="button"
                          className="admin-btn admin-btn--small"
                          onClick={() => coverInputRef.current?.click()}
                          disabled={uploading}
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--small admin-btn--danger"
                          onClick={() => {
                            setCover("");
                            setCoverPreview("");
                            touch();
                          }}
                          disabled={uploading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="admin-cover__drop"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <span className="admin-cover__plus" aria-hidden>
                        +
                      </span>
                      <span>{uploading ? "Uploading image…" : "Drop an image or click to upload"}</span>
                      <em>JPEG, PNG, WebP, GIF · resized and compressed automatically</em>
                    </button>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      void handleCoverFile(file);
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="admin-panel admin-composer">
            <div className="admin-panel__head">
              <span className="admin-panel__label">BODY / MARKDOWN</span>
              <span className="admin-hint">
                {wordCount} words · ~{readMinutes} min read
                {uploading ? " · UPLOADING IMAGE…" : ""}
              </span>
            </div>

            <div className="admin-toolbar" role="toolbar" aria-label="Markdown formatting">
              <button type="button" onClick={() => replaceSelection("**", "**", "bold text")} title="Bold">
                B
              </button>
              <button type="button" onClick={() => replaceSelection("*", "*", "italic text")} title="Italic">
                <em>I</em>
              </button>
              <button type="button" onClick={() => replaceSelection("`", "`", "code")} title="Inline code">
                {"</>"}
              </button>
              <span className="admin-toolbar__sep" aria-hidden />
              <button type="button" onClick={() => replaceSelection("## ", "", "Heading")} title="Heading 2">
                H2
              </button>
              <button type="button" onClick={() => replaceSelection("### ", "", "Heading")} title="Heading 3">
                H3
              </button>
              <button type="button" onClick={insertLink} title="Link">
                Link
              </button>
              <button
                type="button"
                onClick={() => replaceSelection("\n```\n", "\n```\n", "code")}
                title="Code block"
              >
                {"{ }"}
              </button>
              <span className="admin-toolbar__sep" aria-hidden />
              <button type="button" onClick={() => transformLines((line) => `> ${line}`)} title="Blockquote">
                Quote
              </button>
              <button type="button" onClick={() => transformLines((line) => `- ${line}`)} title="Bulleted list">
                List
              </button>
              <button
                type="button"
                onClick={() => transformLines((line, index) => `${index + 1}. ${line.replace(/^\d+\.\s+/, "")}`)}
                title="Numbered list"
              >
                1.
              </button>
              <span className="admin-toolbar__sep" aria-hidden />
              <button
                type="button"
                onClick={() =>
                  insertAtCursor("\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n")
                }
                title="Table"
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => replaceSelection("\n$$\n", "\n$$\n", "E = mc^2")}
                title="Math block"
              >
                ∑
              </button>
              <button type="button" onClick={() => insertAtCursor("\n\n---\n\n")} title="Divider">
                —
              </button>
              <span className="admin-toolbar__sep" aria-hidden />
              <button
                type="button"
                onClick={() => contentImageInputRef.current?.click()}
                title="Upload image"
                disabled={uploading}
              >
                Image +
              </button>
            </div>

            <div className={`admin-composer__drop${contentDrag ? " is-over" : ""}`}>
              <textarea
                ref={textareaRef}
                className="admin-editor__textarea"
                value={content}
                onChange={(event) => setContentAndDirty(event.target.value)}
                onKeyDown={handleContentKeyDown}
                onPaste={handleContentPaste}
                onDrop={handleContentDrop}
                onDragOver={(event) => {
                  if (event.dataTransfer.types.includes("Files")) {
                    event.preventDefault();
                    setContentDrag(true);
                  }
                }}
                onDragLeave={() => setContentDrag(false)}
                placeholder={
                  "Write in Markdown…\n\n## A heading\nSome text with a [link](https://example.com).\n\n![Alt text](/blog/slug/image.webp \"Optional caption\")\n\n- A list item\n- Another item"
                }
                spellCheck
              />
              {contentDrag ? (
                <div className="admin-composer__drop-overlay" aria-hidden>
                  Drop image to upload
                </div>
              ) : null}
            </div>

            <div className="admin-composer__foot">
              <span className="admin-hint">
                Drop or paste images directly into the textarea. Markdown images use the
                title as a caption.
              </span>
              <input
                ref={contentImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                multiple
                hidden
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  event.target.value = "";
                  void (async () => {
                    for (const file of files) {
                      await insertContentImage(file);
                    }
                  })();
                }}
              />
            </div>
          </section>
        </div>

        <aside className="admin-editor__side">
          <section className="admin-preview">
            <div className="admin-panel__head admin-preview__head">
              <span className="admin-panel__label">LIVE PREVIEW</span>
              <span className={`admin-preview__state admin-preview__state--${previewState}`}>
                {previewLabel}
              </span>
            </div>

            <div className="admin-preview__body">
              {previewState === "error" ? (
                <div className="admin-alert admin-alert--error" role="alert">
                  {previewError}
                </div>
              ) : previewHtml ? (
                <MarkdownBody html={previewHtml} className="md-body--preview" />
              ) : (
                <div className="admin-preview__empty">
                  <span className="blog-empty__code">{"// preview"}</span>
                  <p>Start writing and the rendered post will appear here.</p>
                </div>
              )}
            </div>

            {storageMode === "github" ? (
              <div className="admin-preview__foot">
                Images use raw GitHub URLs until Vercel redeploys.
              </div>
            ) : null}
          </section>
        </aside>
      </div>

      {!isNew ? (
        <section className="admin-danger">
          <div>
            <span className="label">Danger zone</span>
            <p>Deleting removes the markdown file and every image uploaded for this entry.</p>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={() => void handleDelete()}
            disabled={deleting || saving || uploading}
          >
            {deleting ? "Deleting…" : "Delete entry"}
          </button>
        </section>
      ) : null}
    </div>
  );
}
