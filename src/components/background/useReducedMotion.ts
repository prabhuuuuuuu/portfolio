"use client";

import { useState } from "react";

const COLORS = {
  bg: "#0a0a0a",
  blue: "#3b82f6",
  cyan: "#06b6d4",
} as const;

function detectReducedMotion() {
  if (typeof window === "undefined") return true;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return isTouch || prefersReduced;
}

export function useReducedMotion(): boolean {
  const [reduced] = useState(detectReducedMotion);
  return reduced;
}

export { COLORS };
