"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/portfolio-data";
import { clipReveal, viewportOnce } from "@/lib/motion";
import { TelemetryLine } from "@/components/TelemetryTicker";

type Props = {
  project: Project;
  index: number;
  /** Stagger offset (s) for the scroll reveal. */
  delay?: number;
};

const MAX_TILT = 7; // degrees

export function ProjectCard({ project, index, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position normalized to -0.5..0.5 for the tilt, 0..100% for the glow.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), {
    stiffness: 180,
    damping: 20,
  });
  const lift = useSpring(0, { stiffness: 200, damping: 22 });
  const glowX = useTransform(px, (v) => `${(v + 0.5) * 100}%`);
  const glowY = useTransform(py, (v) => `${(v + 0.5) * 100}%`);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    lift.set(-6);
  };

  const onLeave = () => {
    px.set(0);
    py.set(0);
    lift.set(0);
  };

  const num = String(index + 1).padStart(2, "0");

  return (
    // Outer element is what IntersectionObserver watches. It must NOT carry
    // the clip-path: Chromium clips the intersection rect by clip-path, so a
    // 100%-clipped element reports ratio 0 and never crosses the threshold.
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{ hidden: {}, show: {} }}
      style={{ height: "100%" }}
    >
      <motion.div variants={clipReveal} custom={delay} style={{ height: "100%", perspective: 1200 }}>
      <motion.article
        ref={ref}
        className={`project-card${project.featured ? " project-card--featured" : ""}`}
        data-cursor="view"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          y: lift,
          // @ts-expect-error CSS custom properties are fine on MotionStyle
          "--mx": glowX,
          "--my": glowY,
        }}
      >
        <span className="project-card__glow" aria-hidden />
        <span className="project-card__border" aria-hidden />

        <header className="project-card__head">
          <div style={{ display: "grid", gap: 10 }}>
            <span className="project-card__index">
              {num} <span style={{ color: "var(--line-strong)" }}>/</span> {project.eyebrow}
            </span>
            {project.featured && (
              <span className="project-card__featured-tag">
                <span className="telemetry__dot" style={{ marginRight: 0 }} />
                Featured
              </span>
            )}
          </div>
          <span className="project-card__metric">{project.metric}</span>
        </header>

        <h3 className="project-card__title">{project.title}</h3>

        <p className="project-card__copy">
          {project.problem} <strong>{project.outcome}</strong>
        </p>

        <ul className="project-card__tech">
          {project.tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <footer className="project-card__foot">
          <div className="project-card__links">
            {project.githubHref && (
              <a href={project.githubHref} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {project.siteHref && (
              <a href={project.siteHref} target="_blank" rel="noreferrer">
                Site
              </a>
            )}
          </div>
          <TelemetryLine k={`PRJ_${num}`} v={project.metric} live={project.featured} />
        </footer>
      </motion.article>
      </motion.div>
    </motion.div>
  );
}
