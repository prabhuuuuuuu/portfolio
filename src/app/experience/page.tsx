import type { Metadata } from "next";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { pageMetadata } from "@/lib/portfolio-data";

export const metadata: Metadata = pageMetadata(
  "Experience",
  "Timeline of Pranav Prashant Shewale's work: Sentrix Robotics, Bonzai, UrbanDienst, IIT Mandi, and VIT Chennai.",
  "/experience",
);

export default function ExperiencePage() {
  return <ExperienceSection />;
}
