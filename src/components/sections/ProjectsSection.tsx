"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/portfolio-data";
import { fadeUp, stagger } from "@/lib/motion";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectsSection() {
  return (
    <section id="projects">
      <motion.div
        className="section-head"
        initial="hidden"
        animate="show"
        variants={stagger(0.08, 0.2)}
      >
        <motion.p variants={fadeUp} className="label">
          02. spec // projects
        </motion.p>
        <motion.h2 variants={fadeUp} className="display">
          Selected Works
        </motion.h2>
      </motion.div>

      <div className="project-grid">
        {projects.map((project, i) => (
          <div
            key={project.title}
            className={project.featured ? "project-cell project-cell--wide" : "project-cell"}
          >
            <ProjectCard project={project} index={i} delay={(i % 3) * 0.08} />
          </div>
        ))}
      </div>
    </section>
  );
}
