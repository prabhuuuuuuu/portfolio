"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: "-80px 0px -80px 0px",
  threshold: 0.1,
};

export function useScrollReveal(className: string, options = DEFAULT_OPTIONS) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
          }
        });
      },
      { ...options, rootMargin: "-60px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [className, options.rootMargin]);

  return ref;
}

export function ScrollRevealSection({
  children,
  className,
  as: Tag = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("scroll-reveal-visible");
          }
        });
      },
      { rootMargin: "-60px 0px -60px 0px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={`scroll-reveal ${className || ""}`} {...props}>
      {children}
    </Tag>
  );
}

export function ParallaxImage({ children, speed = 0.05 }: { children: React.ReactNode; speed?: number }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      offsetRef.current = (viewCenter - center) * speed;
    };

    const tick = () => {
      const target = offsetRef.current;
      currentRef.current += (target - currentRef.current) * 0.08;
      el.style.transform = `translate3d(0, ${currentRef.current}px, 0)`;
      el.style.willChange = "transform";
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 10);
    };
    window.addEventListener("scroll", debouncedScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [speed, reducedMotion]);

  if (reducedMotion) return <>{children}</>;
  return (
    <div ref={ref} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

export function TextReveal({ children, className = "" }: { children: string; className?: string }) {
  const words = children.split(" ");
  return (
    <span className={`text-reveal ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="text-reveal-word" style={{ animationDelay: `${i * 0.06}s` }}>
          {i > 0 ? "\u00A0" : null}{word}
        </span>
      ))}
    </span>
  );
}
