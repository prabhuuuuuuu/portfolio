"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { pageEnter } from "@/lib/motion";

/**
 * template.tsx remounts on every navigation, which gives us a reliable
 * route-enter animation in the App Router (exit animations are not
 * supported by the router's streaming model, so we only animate in).
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial="hidden" animate="show" variants={pageEnter}>
      {children}
    </motion.div>
  );
}
