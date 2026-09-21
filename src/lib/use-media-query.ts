"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query without effect+setState churn.
 * `serverFallback` is what SSR / first client render sees.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
