"use client";

import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0a0a0a",
  blue: "#3b82f6",
  cyan: "#06b6d4",
} as const;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isTouch || prefersReduced);
  }, []);

  return reduced;
}

export { COLORS };
