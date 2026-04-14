"use client";

import React, { useRef, useEffect } from "react";
import { COLORS } from "./useReducedMotion";

const MAX_PARTICLES = 42;
const CONNECT_THRESHOLD = 100;
const MOUSE_RADIUS = 150;
const REPEL_STRENGTH = 0.8;
const FLOAT_SPEED_MIN = 0.2;
const FLOAT_SPEED_MAX = 0.6;
const LINE_OPACITY = 0.1;
const PARTICLE_RADIUS = 1.5;
const TARGET_FRAME_MS = 1000 / 30;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  angle: number;
  size: number;
  color: string;
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(MAX_PARTICLES, Math.floor((window.innerWidth * window.innerHeight) / 15000));
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: 0,
          vy: 0,
          baseSpeed: FLOAT_SPEED_MIN + Math.random() * (FLOAT_SPEED_MAX - FLOAT_SPEED_MIN),
          angle: Math.random() * Math.PI * 2,
          size: PARTICLE_RADIUS,
          color: Math.random() > 0.5 ? COLORS.blue : COLORS.cyan,
        });
      }
      particlesRef.current = particles;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleLeave);

    let lastFrameTime = 0;
    const tick = (now = performance.now()) => {
      rafRef.current = requestAnimationFrame(tick);
      if (now - lastFrameTime < TARGET_FRAME_MS) return;
      lastFrameTime = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * REPEL_STRENGTH * 2;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }
        p.angle += 0.002 + Math.random() * 0.004;
        p.vx += Math.cos(p.angle) * p.baseSpeed * 0.1;
        p.vy += Math.sin(p.angle) * p.baseSpeed * 0.1;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -0.5;
        if (p.y < 0 || p.y > h) p.vy *= -0.5;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      });

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d < CONNECT_THRESHOLD) {
            const alpha = LINE_OPACITY * (1 - d / CONNECT_THRESHOLD);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafRef.current);
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
