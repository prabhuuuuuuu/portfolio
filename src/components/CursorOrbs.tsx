"use client";

import { useRef, useEffect } from "react";

type Orb = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  blur: number;
  opacity: number;
};

const ORB_COUNT = 12;
const ORB_BASE_SIZE = 80;
const ORB_INFLUENCE = 140;
const ORB_SMOOTH = 0.06;

function createOrbs(): Orb[] {
  return Array.from({ length: ORB_COUNT }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    baseX: Math.random() * 100,
    baseY: Math.random() * 100,
    size: 40 + Math.random() * ORB_BASE_SIZE,
    blur: 40 + Math.random() * 60,
    opacity: 0.03 + Math.random() * 0.06,
  }));
}

export function CursorOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 50, y: 50 });
  const orbsRef = useRef<Orb[]>([]);

  useEffect(() => {
    if (orbsRef.current.length === 0) {
      orbsRef.current = createOrbs();
    }

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mouse = mouseRef.current;
      const orbs = orbsRef.current;

      ctx.clearRect(0, 0, w, h);

      orbs.forEach((orb) => {
        const dx = mouse.x - orb.baseX;
        const dy = mouse.y - orb.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 1 - dist / 50) * ORB_INFLUENCE * 0.02;
        orb.x += (orb.baseX + (dx / (dist || 1)) * force - orb.x) * ORB_SMOOTH;
        orb.y += (orb.baseY + (dy / (dist || 1)) * force - orb.y) * ORB_SMOOTH;

        const px = (orb.x / 100) * w;
        const py = (orb.y / 100) * h;
        const r = orb.size / 2;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, r);
        gradient.addColorStop(0, `rgba(79, 140, 255, ${orb.opacity})`);
        gradient.addColorStop(0.5, `rgba(79, 140, 255, ${orb.opacity * 0.3})`);
        gradient.addColorStop(1, "rgba(79, 140, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  );
}
