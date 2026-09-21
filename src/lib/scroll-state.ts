/**
 * Frame-rate-friendly scroll state shared between lenis and the WebGL layers.
 * Mutated in place (no React state) so shaders can read it every frame.
 */
export const scrollState = {
  /** Raw lenis velocity (px per frame-ish). */
  velocity: 0,
  /** Smoothed, normalized velocity in roughly -1..1. */
  smoothVelocity: 0,
  /** 0..1 document progress. */
  progress: 0,
  /** Absolute scroll position. */
  scroll: 0,
};
