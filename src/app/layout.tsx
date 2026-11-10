import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteShell } from "@/components/SiteShell";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CursorProvider } from "@/components/cursor/CustomCursor";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/portfolio-data";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  applicationName: "Pranav Shewale Portfolio",
  authors: [{ name: "Pranav Prashant Shewale" }],
  keywords: [
    "Pranav Prashant Shewale",
    "physical AI",
    "robotics",
    "tactile sensing",
    "sim-to-real reinforcement learning",
    "robot perception",
    "computer vision",
    "VIT Chennai",
    "Sentrix Robotics",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
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
    title: siteTitle,
    description: siteDescription,
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
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#131211" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <CursorProvider>
          <SmoothScroll>
            <SiteShell>{children}</SiteShell>
          </SmoothScroll>
        </CursorProvider>
      </body>
    </html>
  );
}
