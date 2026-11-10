import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { getAdminConfigStatus, getAdminSession } from "@/lib/admin/auth";
import { toPostSummary } from "@/lib/blog/content";
import { BlogStoreError } from "@/lib/blog/errors";
import { blogStore, getStorageLabel, getStorageStatus } from "@/lib/blog/store";
import type { BlogPostMeta } from "@/lib/blog/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  const adminConfig = getAdminConfigStatus();

  if (!session) {
    return <AdminLogin configured={adminConfig.configured} missing={adminConfig.missing} />;
  }

  let posts: BlogPostMeta[] = [];
  let loadError: string | undefined;

  try {
    posts = (await blogStore.listPosts()).map(toPostSummary);
  } catch (error) {
    loadError =
      error instanceof BlogStoreError
        ? error.message
        : "The blog store could not be reached. Check the server logs.";
  }

  const storage = getStorageStatus();

  return (
    <AdminDashboard
      posts={posts}
      storage={storage}
      storageLabel={getStorageLabel()}
      loadError={loadError}
    />
  );
}
