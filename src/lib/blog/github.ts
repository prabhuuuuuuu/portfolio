import { parsePost, serializePost } from "./content";
import { BlogStoreError } from "./errors";
import type {
  BlogPost,
  DeleteResult,
  PostInput,
  SaveResult,
  StorageStatus,
  UploadResult,
} from "./types";

const API = "https://api.github.com";

type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  configured: boolean;
  missing: string[];
};

type ContentsEntry = {
  name: string;
  path: string;
  sha: string;
  type: string;
  content?: string;
  encoding?: string;
  download_url?: string | null;
};

type ContentsCommit = {
  commit?: { html_url?: string };
};

export function getGithubConfig(): GithubConfig {
  const token = process.env.GITHUB_TOKEN?.trim() ?? "";
  const owner = process.env.GITHUB_OWNER?.trim() || "prabhuuuuuuu";
  const repo = process.env.GITHUB_REPO?.trim() || "portfolio";
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  const missing: string[] = [];

  if (!token) missing.push("GITHUB_TOKEN");
  if (!owner) missing.push("GITHUB_OWNER");
  if (!repo) missing.push("GITHUB_REPO");
  if (!branch) missing.push("GITHUB_BRANCH");

  return {
    token,
    owner,
    repo,
    branch,
    configured: missing.length === 0,
    missing,
  };
}

export function getGithubStorageStatus(): StorageStatus {
  const config = getGithubConfig();
  return {
    mode: "github",
    configured: config.configured,
    missing: config.missing,
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
  };
}

export function getGithubPreviewBaseUrl() {
  const { owner, repo, branch } = getGithubConfig();
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public`;
}

function contentPath(...segments: string[]) {
  return segments.map((segment) => encodeURIComponent(segment)).join("/");
}

async function githubRequest(path: string, init: RequestInit = {}) {
  const { token } = getGithubConfig();
  if (!token) {
    throw new BlogStoreError(
      "GitHub storage is not configured. Add GITHUB_TOKEN to the environment.",
      503,
    );
  }

  return fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "pranav-portfolio-blog",
      ...(init.headers ?? {}),
    },
  });
}

async function githubJson<T>(
  path: string,
  init: RequestInit = {},
  options: { allow404?: boolean } = {},
): Promise<T | null> {
  const response = await githubRequest(path, init);

  if (response.status === 404 && options.allow404) return null;

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    const detail = payload?.message ? ` ${payload.message}` : "";
    if (response.status === 401 || response.status === 403) {
      throw new BlogStoreError(
        `GitHub rejected the request. Check that GITHUB_TOKEN can read and write repository contents.${detail}`,
        502,
      );
    }
    if (response.status === 409) {
      throw new BlogStoreError(`GitHub reported a conflict. Refresh the page and try again.${detail}`, 409);
    }
    throw new BlogStoreError(`GitHub request failed (${response.status}).${detail}`, 502);
  }

  if (response.status === 204) return null;
  return (await response.json()) as T;
}

function decodeContentsFile(file: ContentsEntry) {
  if (file.content && file.encoding === "base64") {
    return Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8");
  }
  return null;
}

async function getFile(path: string) {
  return githubJson<ContentsEntry>(
    `/repos/${getGithubConfig().owner}/${getGithubConfig().repo}/contents/${contentPath(
      ...path.split("/"),
    )}?ref=${encodeURIComponent(getGithubConfig().branch)}`,
    { method: "GET" },
    { allow404: true },
  );
}

async function putFile(
  path: string,
  content: string | Buffer,
  message: string,
  sha?: string,
) {
  const config = getGithubConfig();
  return githubJson<ContentsEntry & ContentsCommit>(
    `/repos/${config.owner}/${config.repo}/contents/${contentPath(...path.split("/"))}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: Buffer.isBuffer(content)
          ? content.toString("base64")
          : Buffer.from(content, "utf8").toString("base64"),
        branch: config.branch,
        ...(sha ? { sha } : {}),
      }),
    },
  );
}

async function deleteFile(path: string, message: string, sha: string) {
  const config = getGithubConfig();
  return githubJson<ContentsCommit>(
    `/repos/${config.owner}/${config.repo}/contents/${contentPath(...path.split("/"))}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sha, branch: config.branch }),
    },
  );
}

async function getPost(slug: string): Promise<BlogPost | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = await getFile(`content/blog/${slug}.md`);
  if (!file) return null;

  let raw = decodeContentsFile(file);
  if (!raw && file.download_url) {
    const response = await fetch(file.download_url, { cache: "no-store" });
    if (!response.ok) {
      throw new BlogStoreError("Could not download a post from GitHub.", 502);
    }
    raw = await response.text();
  }
  if (!raw) {
    throw new BlogStoreError("GitHub returned a post without content.", 502);
  }
  return parsePost(raw, slug);
}

export async function listGithubPosts(): Promise<BlogPost[]> {
  const config = getGithubConfig();
  const entries = await githubJson<ContentsEntry[]>(
    `/repos/${config.owner}/${config.repo}/contents/content/blog?ref=${encodeURIComponent(
      config.branch,
    )}`,
    { method: "GET" },
    { allow404: true },
  );

  if (!entries) return [];

  const markdown = entries.filter(
    (entry) => entry.type === "file" && entry.name.endsWith(".md"),
  );

  const results = await Promise.allSettled(
    markdown.map((entry) => getPost(entry.name.replace(/\.md$/, ""))),
  );

  const posts: BlogPost[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      posts.push(result.value);
    } else if (result.status === "rejected") {
      console.error("[blog] Could not load a GitHub post", result.reason);
    }
  }

  return posts.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title),
  );
}

export async function getGithubPost(slug: string) {
  return getPost(slug);
}

export async function saveGithubPost(input: PostInput): Promise<SaveResult> {
  const path = `content/blog/${input.slug}.md`;
  const existing = await getFile(path);
  const action = input.draft ? "save draft" : existing ? "update" : "publish";
  const response = await putFile(
    path,
    serializePost(input),
    `blog: ${action} "${input.title}"`,
    existing?.sha,
  );

  return {
    mode: "github",
    commitUrl: response?.commit?.html_url,
    liveUrl: input.draft ? null : `/blog/${input.slug}`,
  };
}

export async function deleteGithubPost(slug: string): Promise<DeleteResult> {
  const config = getGithubConfig();
  const postPath = `content/blog/${slug}.md`;
  const existing = await getFile(postPath);
  if (!existing) return { mode: "github" };

  const response = await deleteFile(postPath, `blog: delete "${slug}"`, existing.sha);

  // Best-effort cleanup of the post's uploaded images. The post is already gone
  // if this fails, so surface the post deletion as the primary result.
  try {
    const assetEntries = await githubJson<ContentsEntry[]>(
      `/repos/${config.owner}/${config.repo}/contents/public/blog/${encodeURIComponent(
        slug,
      )}?ref=${encodeURIComponent(config.branch)}`,
      { method: "GET" },
      { allow404: true },
    );
    if (assetEntries) {
      for (const entry of assetEntries) {
        if (entry.type !== "file") continue;
        await deleteFile(
          `public/blog/${slug}/${entry.name}`,
          `blog: delete image for "${slug}"`,
          entry.sha,
        );
      }
    }
  } catch (error) {
    console.error("[blog] Post deleted, but image cleanup failed", error);
  }

  return {
    mode: "github",
    commitUrl: response?.commit?.html_url,
  };
}

export async function uploadGithubImage(input: {
  slug: string;
  filename: string;
  data: Buffer;
}): Promise<UploadResult> {
  const config = getGithubConfig();
  const path = `public/blog/${input.slug}/${input.filename}`;
  const existing = await getFile(path);
  const response = await putFile(
    path,
    input.data,
    `blog: upload image for "${input.slug}"`,
    existing?.sha,
  );

  const rawUrl = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${path}`;

  return {
    mode: "github",
    path: `/blog/${input.slug}/${input.filename}`,
    previewUrl: response?.download_url || rawUrl,
    commitUrl: response?.commit?.html_url,
  };
}
