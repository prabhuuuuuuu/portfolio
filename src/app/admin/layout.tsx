import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAdminSession } from "@/lib/admin/auth";
import { getStorageStatus } from "@/lib/blog/store";
import "../blog/blog.css";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  const storage = getStorageStatus();

  return (
    <div className="admin-shell">
      {session ? (
        <AdminHeader username={session.username} storageMode={storage.mode} />
      ) : null}
      <main className="admin-main">{children}</main>
    </div>
  );
}
