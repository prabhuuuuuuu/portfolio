import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./background.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pranav Prashant Shewale | AI Engineer & ML Researcher",
  description: "Portfolio of Pranav Prashant Shewale, focusing on AI, Machine Learning, Computer Vision, and Edge Deployment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased bg-background text-primary`}>
        {children}
      </body>
    </html>
  );
}
