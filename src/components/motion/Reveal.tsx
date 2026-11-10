"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  variants?: Variants;
  /** Delay (s) applied to this element only (passed as `custom`). */
  delay?: number;
  /** Render as a stagger parent: children with `variants` animate in sequence. */
  staggerChildren?: number;
};

/**
 * Scroll-triggered wrapper. Uses whileInView so it plays nicely with lenis
 * (lenis keeps native scrolling, so IntersectionObserver keeps working).
 *
 * The observed element never carries the animated styles itself: Chromium
 * clips the IntersectionObserver rect by `clip-path`, so a clip-based hidden
 * state on the observed node would report ratio 0 and never trigger. The
 * outer div only propagates the variant label; the inner div animates.
 */
export function Reveal({
  variants = fadeUp,
  delay = 0,
  staggerChildren,
  children,
  className,
  style,
  ...rest
}: RevealProps) {
  const inner: Variants = staggerChildren
    ? { hidden: {}, show: { transition: { staggerChildren, delayChildren: delay } } }
    : variants;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{ hidden: {}, show: {} }}
      {...rest}
    >
      <motion.div variants={inner} custom={delay} className={className} style={style}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** A child inside a staggered Reveal. */
export function RevealItem({
  variants = fadeUp,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { variants?: Variants }) {
  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
