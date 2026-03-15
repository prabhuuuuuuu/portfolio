"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: "-80px 0px -80px 0px",
  threshold: 0.1,
};

const REVEAL_MARGIN = "-60px 0px -60px 0px";

// ---------------------------------------------------------------------------
// useScrollReveal — attach a class when the element enters the viewport
// ---------------------------------------------------------------------------

export function useScrollReveal(
  className: string,
  options: IntersectionObserverInit = DEFAULT_OPTIONS
) {
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
      { ...options, rootMargin: REVEAL_MARGIN }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [className, options]);

  return ref;
}

// ---------------------------------------------------------------------------
// ScrollRevealSection — wrapper component that reveals children on scroll
// ---------------------------------------------------------------------------

type ScrollRevealSectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
};

export function ScrollRevealSection({
  children,
  className,
  as: Tag = "div",
  ...props
}: ScrollRevealSectionProps) {
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
      { rootMargin: REVEAL_MARGIN, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const TagComponent = Tag as React.ElementType;

  return (
    <TagComponent
      ref={ref}
      className={`scroll-reveal ${className ?? ""}`.trim()}
      {...props}
    >
      {children}
    </TagComponent>
  );
}

// ---------------------------------------------------------------------------
// ParallaxImage — smooth parallax effect driven by scroll position
// ---------------------------------------------------------------------------

interface ParallaxImageProps {
  children: React.ReactNode;
  speed?: number;
}

export function ParallaxImage({ children, speed = 0.05 }: ParallaxImageProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>(0);

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
      currentRef.current += (offsetRef.current - currentRef.current) * 0.08;
      el.style.transform = `translate3d(0, ${currentRef.current}px, 0)`;
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

// ---------------------------------------------------------------------------
// TextReveal — animates words in one by one with staggered delays
// ---------------------------------------------------------------------------

interface TextRevealProps {
  children: string;
  className?: string;
}

export function TextReveal({ children, className = "" }: TextRevealProps) {
  const words = children.split(" ");

  return (
    <span className={`text-reveal ${className}`.trim()}>
      {words.map((word, i) => (
        <span
          key={i}
          className="text-reveal-word"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {i > 0 ? "\u00A0" : null}
          {word}
        </span>
      ))}
    </span>
  );
}