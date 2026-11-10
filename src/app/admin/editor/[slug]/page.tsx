import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { getAdminSession } from "@/lib/admin/auth";
import { BlogStoreError } from "@/lib/blog/errors";
import { blogStorageMode, blogStore, getPreviewBaseUrl } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit entry",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();

  let post = null;
  try {
    post = await blogStore.getPost(slug);
  } catch (error) {
    if (error instanceof BlogStoreError) {
      console.error("[admin] Could not load post", error);
    } else {
      throw error;
    }
  }

  if (!post) notFound();

  return (
    <PostEditor
      mode="edit"
      initialPost={post}
      previewBase={getPreviewBaseUrl()}
      storageMode={blogStorageMode}
    />
  );
}
