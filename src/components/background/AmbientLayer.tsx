"use client";

import React, { useRef, useEffect } from "react";
import { COLORS } from "./useReducedMotion";

const MATRIX_CHARS = "01アイウエオ";
const MATRIX_OPACITY = 0.04;
const MATRIX_SPEED = 0.02;

export function AmbientLayer({ enableMatrix = false }: { enableMatrix?: boolean }) {
  const orbsRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const matrixRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!orbsRef.current) return;
    const positions = [
      { x: "10%", y: "20%", size: 300, delay: 0 },
      { x: "85%", y: "30%", size: 200, delay: 2 },
      { x: "50%", y: "70%", size: 250, delay: 1 },
      { x: "20%", y: "80%", size: 180, delay: 3 },
      { x: "75%", y: "85%", size: 220, delay: 1.5 },
    ];
    positions.forEach(({ x, y, size, delay }) => {
      const el = document.createElement("div");
      el.className = "ambient-orb";
      el.style.cssText = `
        position: absolute; left: ${x}; top: ${y};
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, ${COLORS.cyan}18 0%, ${COLORS.blue}08 50%, transparent 70%);
        transform: translate(-50%, -50%);
        animation: ambient-orb-float 20s ease-in-out infinite;
        animation-delay: ${delay}s;
        will-change: transform;
      `;
      orbsRef.current!.appendChild(el);
    });
  }, []);

  useEffect(() => {
    if (!enableMatrix) return;
    const canvas = matrixRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = Math.floor(window.innerWidth / 20);
    const drops: number[] = Array(cols).fill(0);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = `rgba(10, 10, 10, ${MATRIX_OPACITY * 3})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = COLORS.cyan;
      ctx.font = "14px monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * 20;
        const y = drops[i] * 20;
        ctx.globalAlpha = MATRIX_OPACITY * (1 - (drops[i] * 20) / canvas.height);
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += MATRIX_SPEED * 2;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [enableMatrix]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div ref={orbsRef} className="absolute inset-0" />
      <div
        ref={noiseRef}
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {enableMatrix && <canvas ref={matrixRef} className="absolute inset-0 w-full h-full" />}
    </div>
  );
}
