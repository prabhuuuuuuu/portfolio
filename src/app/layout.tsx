import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./background.css";
import "./dashboard.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const title = "Pranav Prashant Shewale | AI Engineer & CV Researcher";
const description =
  "Developer-first portfolio for Pranav Prashant Shewale featuring multi-agent systems, computer vision research, edge AI deployment, and production-grade engineering work.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Pranav Shewale Portfolio",
  authors: [{ name: "Pranav Prashant Shewale" }],
  keywords: [
    "Pranav Prashant Shewale",
    "AI engineer",
    "computer vision",
    "multi-agent systems",
    "edge AI",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    siteName: "Pranav Shewale Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Pranav Shewale portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
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
