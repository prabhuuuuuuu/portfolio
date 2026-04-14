"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { Metric } from "./data";

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export function Panel({
  id,
  className = "",
  children,
}: Readonly<{
  id?: string;
  className?: string;
  children: ReactNode;
}>) {
  return (
    <motion.section id={id} variants={cardVariants} className={`panel ${className}`}>
      {children}
    </motion.section>
  );
}

export function MetricPill({ metric }: Readonly<{ metric: Metric }>) {
  return (
    <div className={`metric-pill metric-pill--${metric.tone ?? "cyan"}`}>
      <span className="metric-pill__label">{metric.label}</span>
      <span className="metric-pill__value">{metric.value}</span>
    </div>
  );
}
