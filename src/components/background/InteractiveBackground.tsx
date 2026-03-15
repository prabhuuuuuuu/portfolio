"use client";

import React from "react";
import { useReducedMotion } from "./useReducedMotion";
import { ParticleNetwork } from "./ParticleNetwork";
import { CursorEffects } from "./CursorEffects";
import { AmbientLayer } from "./AmbientLayer";
import { useIsMobile } from "./useIsMobile";

export function InteractiveBackground() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const enableParticles = !reducedMotion && !isMobile;

  return (
    <>
      <AmbientLayer enableMatrix={false} />
      {enableParticles && <ParticleNetwork />}
      {!reducedMotion && <CursorEffects />}
    </>
  );
}
