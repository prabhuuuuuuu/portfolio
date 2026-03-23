"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLITCH_INTERVAL_MIN = 5000;
const GLITCH_INTERVAL_MAX = 10000;

export function GlitchText({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchingRef = useRef(false);
  const [glitching, setGlitching] = useState(false);

  const trigger = useCallback(() => {
    if (glitchingRef.current) return;

    glitchingRef.current = true;
    setGlitching(true);
    ref.current?.classList.add("glitch-active");

    timeoutRef.current = setTimeout(() => {
      ref.current?.classList.remove("glitch-active");
      glitchingRef.current = false;
      setGlitching(false);
    }, 250);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const delay = GLITCH_INTERVAL_MIN + Math.random() * (GLITCH_INTERVAL_MAX - GLITCH_INTERVAL_MIN);
      timeoutRef.current = setTimeout(() => {
        trigger();
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trigger]);

  return (
    <span
      ref={ref}
      className={`glitch-text inline-block ${className}`}
      onMouseEnter={trigger}
      style={{ willChange: glitching ? "transform, clip-path" : "auto" }}
    >
      <span className="glitch-text-visible">{children}</span>
      <span className="glitch-text-glitch glitch-text-glitch-1" aria-hidden>
        {children}
      </span>
      <span className="glitch-text-glitch glitch-text-glitch-2" aria-hidden>
        {children}
      </span>
    </span>
  );
}
