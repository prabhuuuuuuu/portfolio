import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { getAdminSession } from "@/lib/admin/auth";
import { blogStorageMode, getPreviewBaseUrl } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New entry",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  return (
    <PostEditor
      mode="create"
      previewBase={getPreviewBaseUrl()}
      storageMode={blogStorageMode}
    />
  );
}
