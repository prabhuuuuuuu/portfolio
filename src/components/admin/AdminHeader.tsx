"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AdminHeader({
  username,
  storageMode,
}: {
  username: string;
  storageMode: "github" | "local";
}) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function signOut() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin");
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link href="/admin" className="admin-brand" aria-label="Admin dashboard">
          <span className="admin-brand__dot" aria-hidden />
          <span>
            PRANAV <em>/</em> ADMIN
          </span>
        </Link>

        <nav className="admin-nav" aria-label="Admin navigation">
          <Link href="/admin" className={pathname === "/admin" ? "is-active" : undefined}>
            Entries
          </Link>
          <Link href="/admin/editor">New entry</Link>
          <Link href="/blog" target="_blank" rel="noreferrer">
            Blog ↗
          </Link>
          <Link href="/" target="_blank" rel="noreferrer">
            Site ↗
          </Link>
        </nav>

        <div className="admin-header__right">
          <span className={`admin-mode admin-mode--${storageMode}`}>
            {storageMode === "github" ? "GITHUB" : "LOCAL"}
          </span>
          <span className="admin-user" title="Signed in as">
            {username}
          </span>
          <button type="button" className="admin-signout" onClick={signOut} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}
