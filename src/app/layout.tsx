import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./background.css";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Pranav Prashant Shewale | AI Engineer & CV Researcher",
  description:
    "Developer-first portfolio for Pranav Prashant Shewale featuring multi-agent systems, computer vision research, edge AI deployment, and production-grade engineering work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
