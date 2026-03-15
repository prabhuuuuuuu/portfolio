"use client";

import React, { useRef, useEffect } from "react";

const TRAIL_LENGTH = 12;
const TRAIL_FADE_MS = 110;
const FRICTION = 0.72;
const FOLLOW_STRENGTH = 0.32;
const MIN_TRAIL_DISTANCE = 6;
const MIN_TRAIL_INTERVAL_MS = 10;

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

export function CursorEffects() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastTrailPointRef = useRef<TrailPoint | null>(null);
  const posRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
  });
  const hoverRef = useRef(false);
  const rafRef = useRef<number>(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.className = "fixed inset-0 pointer-events-none z-[9998]";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    document.body.classList.add("cursor-effects-active");

    const onMove = (e: PointerEvent) => {
      if (!initializedRef.current) {
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
        initializedRef.current = true;
      }
      posRef.current.tx = e.clientX;
      posRef.current.ty = e.clientY;
    };

    const hoverSelector = "a, button, [role='button'], input, textarea, select";
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(hoverSelector)) {
        hoverRef.current = true;
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(hoverSelector)) {
        hoverRef.current = false;
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    let lastTime = performance.now();

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const dtMs = now - lastTime;
      lastTime = now;
      const dt = dtMs / 16.67; // normalize vs ~60fps

      const pos = posRef.current;
      const dx = pos.tx - pos.x;
      const dy = pos.ty - pos.y;
      pos.vx = (pos.vx + dx * FOLLOW_STRENGTH) * FRICTION;
      pos.vy = (pos.vy + dy * FOLLOW_STRENGTH) * FRICTION;
      pos.x += pos.vx * dt;
      pos.y += pos.vy * dt;

      const nowT = performance.now();
      const lastTrailPoint = lastTrailPointRef.current;
      const trailDistance = lastTrailPoint
        ? Math.hypot(pos.x - lastTrailPoint.x, pos.y - lastTrailPoint.y)
        : Infinity;
      const trailAge = lastTrailPoint ? nowT - lastTrailPoint.t : Infinity;
      if (trailDistance >= MIN_TRAIL_DISTANCE || trailAge >= MIN_TRAIL_INTERVAL_MS) {
        const nextPoint = { x: pos.x, y: pos.y, t: nowT };
        trailRef.current.unshift(nextPoint);
        lastTrailPointRef.current = nextPoint;
        if (trailRef.current.length > TRAIL_LENGTH) {
          trailRef.current.length = TRAIL_LENGTH;
        }
      }

      while (
        trailRef.current.length &&
        nowT - trailRef.current[trailRef.current.length - 1].t > TRAIL_FADE_MS
      ) {
        trailRef.current.pop();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (trailRef.current.length > 1) {
        for (let i = 0; i < trailRef.current.length - 1; i++) {
          const p0 = trailRef.current[i];
          const p1 = trailRef.current[i + 1];
          const age = (nowT - p0.t) / TRAIL_FADE_MS;
          const width = Math.max(0, 8 * (1 - age));
          if (width <= 0) continue;
          const alpha = 0.6 * (1 - age);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      const speed = Math.min(
        Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy) / 20,
        1
      );
      const stretch = 1 + speed;
      const angle = Math.atan2(pos.vy, pos.vx) || Math.PI / 4;
      const hover = hoverRef.current;

      if (cursorRef.current) {
        const scale = hover ? 1.5 : 1;
        const rot = hover ? 0 : angle + Math.PI / 4;
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${rot}rad) scale(${stretch * scale}, ${scale})`;
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("resize", resize);
      document.body.classList.remove("cursor-effects-active");
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: 4,
        height: 4,
        backgroundColor: "#ffffff",
        transform: "translate(-50%, -50%) rotate(45deg)",
        willChange: "transform",
      }}
      aria-hidden
    />
  );
}
