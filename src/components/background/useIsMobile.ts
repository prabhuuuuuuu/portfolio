"use client";

import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & { maxTouchPoints?: number };
    const touch =
      "ontouchstart" in window || (nav.maxTouchPoints ?? 0) > 0;
    const smallScreen = window.innerWidth <= 768;
    setIsMobile(touch || smallScreen);
  }, []);

  return isMobile;
}

