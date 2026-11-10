"use client";

import { useEffect, useState } from "react";

export function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(id);
  }, [copied]);

  function currentUrl() {
    return typeof window === "undefined" ? "" : window.location.href;
  }

  function openWindow(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="share-links">
      <button
        type="button"
        onClick={() =>
          openWindow(
            `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(
              currentUrl(),
            )}`,
          )
        }
      >
        X ↗
      </button>
      <button
        type="button"
        onClick={() =>
          openWindow(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              currentUrl(),
            )}`,
          )
        }
      >
        LinkedIn ↗
      </button>
      <button type="button" onClick={copyLink} aria-live="polite">
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
