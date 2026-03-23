"use client";

import { useState } from "react";

function detectMobile() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { maxTouchPoints?: number };
  const touch = "ontouchstart" in window || (nav.maxTouchPoints ?? 0) > 0;
  const smallScreen = window.innerWidth <= 768;
  return touch || smallScreen;
}

export function useIsMobile() {
  const [isMobile] = useState(detectMobile);
  return isMobile;
}
