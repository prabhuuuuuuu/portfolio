import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { pageMetadata } from "@/lib/portfolio-data";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Get in touch with Pranav Prashant Shewale via the contact form, LinkedIn, GitHub, or email.",
  "/contact",
);

export default function ContactPage() {
  return <ContactSection />;
}
