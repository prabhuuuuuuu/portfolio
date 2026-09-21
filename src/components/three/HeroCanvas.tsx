"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { TactileField } from "./TactileField";
import { useCursor } from "@/components/cursor/CustomCursor";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Hero centerpiece canvas. Renders client-side only (the parent dynamic()
 * imports it with ssr:false). Resolution and DPR scale down on small
 * screens and reduced-motion users get a static, cheaper frameloop.
 */
export function HeroCanvas() {
  const small = useMediaQuery("(max-width: 900px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const segments = small ? 80 : 140;
  const { setState } = useCursor();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.4, 5.2], fov: 38, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <TactileField
          segments={segments}
          onHoverChange={(h) => setState(h ? "crosshair" : "default")}
        />
        <AdaptiveDpr pixelated />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
