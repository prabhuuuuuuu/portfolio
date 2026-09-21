"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { scrollState } from "@/lib/scroll-state";

/**
 * Momentum scrolling via lenis. Keeps native scroll (so IntersectionObserver
 * + framer-motion whileInView keep working) and publishes velocity to
 * `scrollState` and the `--scroll-velocity` CSS variable for shaders/CSS.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  // New route: jump to top without momentum.
  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        syncTouch: false,
      }}
    >
      <VelocityBridge />
      {children}
    </ReactLenis>
  );
}

function VelocityBridge() {
  useLenis(({ velocity, progress, scroll }) => {
    scrollState.velocity = velocity;
    scrollState.progress = progress;
    scrollState.scroll = scroll;
    // Normalize (~40px/frame => 1) and smooth so the shader doesn't stutter.
    const target = Math.max(-1, Math.min(1, velocity / 40));
    scrollState.smoothVelocity += (target - scrollState.smoothVelocity) * 0.12;
    document.documentElement.style.setProperty(
      "--scroll-velocity",
      scrollState.smoothVelocity.toFixed(3),
    );
  });
  return null;
}
