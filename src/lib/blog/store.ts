import {
  deleteGithubPost,
  getGithubConfig,
  getGithubPost,
  getGithubPreviewBaseUrl,
  getGithubStorageStatus,
  listGithubPosts,
  saveGithubPost,
  uploadGithubImage,
} from "./github";
import {
  deleteLocalPost,
  getLocalAdminPost,
  listLocalAdminPosts,
  saveLocalPost,
  uploadLocalImage,
} from "./local";
import type { PostInput, StorageStatus, StoreMode } from "./types";

function resolveMode(): StoreMode {
  const configured = process.env.BLOG_STORAGE?.trim().toLowerCase();
  if (configured === "github" || configured === "local") return configured;
  return process.env.VERCEL ? "github" : "local";
}

export const blogStorageMode: StoreMode = resolveMode();

export const blogStore = {
  listPosts:
    blogStorageMode === "github" ? listGithubPosts : listLocalAdminPosts,
  getPost:
    blogStorageMode === "github" ? getGithubPost : getLocalAdminPost,
  savePost:
    blogStorageMode === "github" ? saveGithubPost : saveLocalPost,
  deletePost:
    blogStorageMode === "github" ? deleteGithubPost : deleteLocalPost,
  uploadImage:
    blogStorageMode === "github" ? uploadGithubImage : uploadLocalImage,
};

export function getStorageStatus(): StorageStatus {
  if (blogStorageMode === "github") return getGithubStorageStatus();
  return {
    mode: "local",
    configured: !process.env.VERCEL,
    missing: process.env.VERCEL ? ["GITHUB_TOKEN"] : [],
  };
}

/** Prefix used by the editor to display images before a Vercel redeploy. */
export function getPreviewBaseUrl() {
  return blogStorageMode === "github" ? getGithubPreviewBaseUrl() : "";
}

export function getStorageLabel() {
  if (blogStorageMode === "github") {
    const config = getGithubConfig();
    return `${config.owner}/${config.repo}@${config.branch}`;
  }
  return "local filesystem";
}

export type { PostInput };
