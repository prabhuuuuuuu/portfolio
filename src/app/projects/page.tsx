import type { Metadata } from "next";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { pageMetadata } from "@/lib/portfolio-data";

export const metadata: Metadata = pageMetadata(
  "Projects",
  "Selected works by Pranav Prashant Shewale spanning vision pipelines, LLM agents, and edge deployments.",
  "/projects",
);

export default function ProjectsPage() {
  return <ProjectsSection />;
}
