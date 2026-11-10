"use client";

import Link from "next/link";
import { useState } from "react";

export function AdminLogin({
  configured,
  missing,
}: {
  configured: boolean;
  missing: string[];
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Sign in failed.");
        setLoading(false);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__panel">
        <div className="admin-login__top">
          <Link href="/" className="admin-brand">
            <span className="admin-brand__dot" aria-hidden />
            <span>
              PRANAV <em>/</em> ADMIN
            </span>
          </Link>
          <span className="admin-login__tag telemetry">
            <i className="telemetry__dot" aria-hidden />
            AUTHORIZED ONLY
          </span>
        </div>

        <h1 className="admin-login__title">
          Lab console
          <span>access</span>
        </h1>
        <p className="admin-login__intro">
          Sign in to write, edit, and publish notes. Sessions last seven days on this
          browser.
        </p>

        {!configured ? (
          <div className="admin-alert admin-alert--warn" role="alert">
            <strong>Admin is not configured on this deployment.</strong>
            <span>Add these environment variables, then redeploy:</span>
            <code>{missing.join(", ")}</code>
          </div>
        ) : null}

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span className="admin-field__label">Username</span>
            <input
              className="admin-input"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={!configured || loading}
              required
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Password</span>
            <input
              className="admin-input"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!configured || loading}
              required
            />
          </label>

          {error ? (
            <div className="admin-alert admin-alert--error" role="alert">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-login__submit"
            disabled={!configured || loading}
          >
            {loading ? "Authenticating…" : "Authenticate"}
            <span aria-hidden>→</span>
          </button>
        </form>

        <div className="admin-login__foot">
          <Link href="/">← Back to site</Link>
          <span>PRANAV SHEWALE / BLOG</span>
        </div>
      </div>
    </div>
  );
}
