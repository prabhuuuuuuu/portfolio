"use client";

import React, { useRef, useEffect, useCallback } from "react";

const SPACING = 48;
const POINT_RADIUS = 0.5;
const LINE_OPACITY = 0.08;
const MOUSE_INFLUENCE = 80;
const MOUSE_RADIUS = 120;

export function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pointsRef = useRef<{ x: number; y: number; baseX: number; baseY: number }[]>([]);
  const animationRef = useRef<number>(0);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const cols = Math.ceil(w / SPACING) + 2;
    const rows = Math.ceil(h / SPACING) + 2;
    const points: { x: number; y: number; baseX: number; baseY: number }[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        points.push({
          baseX: j * SPACING,
          baseY: i * SPACING,
          x: j * SPACING,
          y: i * SPACING,
        });
      }
    }
    pointsRef.current = points;
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;
      const points = pointsRef.current;

      ctx.clearRect(0, 0, w, h);

      const scaleX = w / (window.innerWidth || 1);
      const scaleY = h / (window.innerHeight || 1);
      const mx = mouse.x * scaleX;
      const my = mouse.y * scaleY;

      points.forEach((p, i) => {
        const dx = mx - p.baseX * dpr;
        const dy = my - p.baseY * dpr;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS * dpr) {
          const force = (1 - dist / (MOUSE_RADIUS * dpr)) * MOUSE_INFLUENCE;
          const angle = Math.atan2(dy, dx);
          p.x = p.baseX + (Math.cos(angle) * force);
          p.y = p.baseY + (Math.sin(angle) * force);
        } else {
          p.x += (p.baseX - p.x) * 0.08;
          p.y += (p.baseY - p.y) * 0.08;
        }
      });

      ctx.strokeStyle = `rgba(79, 140, 255, ${LINE_OPACITY})`;
      ctx.lineWidth = 1;

      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const ax = a.x * dpr;
        const ay = a.y * dpr;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const bx = b.x * dpr;
          const by = b.y * dpr;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < SPACING * 1.8 * dpr) {
            ctx.globalAlpha = LINE_OPACITY * (1 - d / (SPACING * 1.8 * dpr));
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = `rgba(79, 140, 255, ${LINE_OPACITY * 2})`;
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, POINT_RADIUS * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const tick = () => {
      draw();
      animationRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  );
}
