import type { Transition, Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Shared easing / timing                                              */
/* ------------------------------------------------------------------ */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

export const transition = {
  fast: { duration: 0.45, ease: EASE_OUT_EXPO } satisfies Transition,
  base: { duration: 0.8, ease: EASE_OUT_EXPO } satisfies Transition,
  slow: { duration: 1.2, ease: EASE_OUT_EXPO } satisfies Transition,
  spring: { type: "spring", stiffness: 180, damping: 22, mass: 0.6 } satisfies Transition,
};

/* Default viewport config for whileInView reveals */
export const viewportOnce = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;

/* ------------------------------------------------------------------ */
/*  Variants                                                            */
/* ------------------------------------------------------------------ */

/** Fade + rise. `custom` = optional delay in seconds. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { ...transition.base, delay } }),
};

/** Pure fade. `custom` = optional delay in seconds. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({ opacity: 1, transition: { ...transition.base, delay } }),
};

/**
 * Clip-path reveal: the element is wiped in from the bottom edge while it
 * settles upward. Pair with `transform-style: preserve-3d` parents for tilt.
 */
export const clipReveal: Variants = {
  hidden: {
    clipPath: "inset(100% 0% 0% 0% round 2px)",
    y: 24,
    opacity: 0.001,
  },
  // Accepts a per-element delay via `custom={delay}`.
  show: (delay: number = 0) => ({
    clipPath: "inset(0% 0% 0% 0% round 2px)",
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: EASE_IN_OUT_QUART, delay },
  }),
};

/** Horizontal wipe, used for hairlines / section dividers. */
export const wipeX: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  show: { scaleX: 1, originX: 0, transition: transition.slow },
};

/** Line-by-line text mask reveal (wrap each line in an overflow-hidden span). */
export const lineMask: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};

/** Perspective tilt entrance for cards in a grid. */
export const tiltIn: Variants = {
  hidden: { opacity: 0, rotateX: 12, y: 40, transformPerspective: 1000 },
  show: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transformPerspective: 1000,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

/** Parent container that staggers its children. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Route enter (template.tsx): a top-down wipe + settle. */
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 16, clipPath: "inset(0% 0% 100% 0%)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.9, ease: EASE_IN_OUT_QUART },
  },
};
