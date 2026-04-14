"use client";

import { motion } from "framer-motion";
import { Activity, ExternalLink } from "lucide-react";
import { MetricPill, cardVariants } from "./Panel";
import { Project } from "./data";

export function ProjectCard({
  project,
  className = "",
}: Readonly<{
  project: Project;
  className?: string;
}>) {
  const Wrapper = project.href ? motion.a : motion.div;
  const wrapperProps = project.href
    ? {
        href: project.href,
        target: "_blank",
        rel: "noreferrer",
      }
    : {};

  return (
    <Wrapper
      variants={cardVariants}
      className={`panel panel--interactive group h-full min-h-[290px] p-5 ${className}`.trim()}
      {...wrapperProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="panel-kicker">{project.category}</p>
          <h3 className="mt-3 font-mono text-xl font-semibold text-slate-100">{project.title}</h3>
        </div>
        {project.href ? (
          <ExternalLink className="h-5 w-5 shrink-0 text-slate-500 transition-colors group-hover:text-[var(--accent-cyan)]" />
        ) : (
          <Activity className="h-5 w-5 shrink-0 text-slate-500 transition-colors group-hover:text-[var(--accent-green)]" />
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{project.summary}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {project.metrics.map((metric) => (
          <MetricPill key={`${project.id}-${metric.label}`} metric={metric} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span key={`${project.id}-${item}`} className="stack-tag">
            {item}
          </span>
        ))}
      </div>

      <div className="terminal-reveal mt-6 rounded-xl border border-slate-800 bg-[#05070a] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">
          hover trace
        </p>
        <div className="mt-3 space-y-2 font-mono text-xs text-slate-300">
          {project.flags.map((flag) => (
            <div key={`${project.id}-${flag}`} className="flex items-center gap-3">
              <span className="text-[var(--accent-green)]">$</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
