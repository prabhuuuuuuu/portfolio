export type BlogPostMeta = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  cover?: string;
  draft: boolean;
  /** Whole minutes, computed from the body. */
  readingTime: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

export type PostInput = {
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  cover?: string;
  content: string;
  draft: boolean;
};

export type StoreMode = "github" | "local";

export type StorageStatus = {
  mode: StoreMode;
  configured: boolean;
  missing: string[];
  owner?: string;
  repo?: string;
  branch?: string;
};

export type SaveResult = {
  mode: StoreMode;
  commitUrl?: string;
  liveUrl: string | null;
};

export type DeleteResult = {
  mode: StoreMode;
  commitUrl?: string;
};

export type UploadResult = {
  mode: StoreMode;
  /** Public path stored in markdown, e.g. /blog/slug/image.webp. */
  path: string;
  /** URL the admin can display before the site redeploys. */
  previewUrl: string;
  commitUrl?: string;
};
