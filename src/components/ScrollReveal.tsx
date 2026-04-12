"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const navDots = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-dot]"));
    const navLinks = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-link]"));
    const follower = document.querySelector<HTMLElement>(".cursor-follower");
    const magneticElements = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const revealObserver = reduceMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add("is-visible");
              revealObserver?.unobserve(entry.target);
            });
          },
          {
            threshold: 0.16,
            rootMargin: "0px 0px -32px 0px",
          },
        );

    if (reduceMotion) {
      reveals.forEach((element) => element.classList.add("is-visible"));
    } else {
      reveals.forEach((element) => revealObserver?.observe(element));
    }

    const setActiveSection = (id: string) => {
      navDots.forEach((dot) => {
        dot.classList.toggle("is-active", dot.dataset.navDot === id);
      });
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.navLink === id);
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!(visible?.target instanceof HTMLElement)) {
          return;
        }

        setActiveSection(visible.target.id);
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-20% 0px -45% 0px",
      },
    );

    sections.forEach((section) => sectionObserver.observe(section));
    if (sections[0]) {
      setActiveSection(sections[0].id);
    }

    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--parallax-y", `${Math.min(10, window.scrollY * 0.015).toFixed(2)}px`);
    };

    const handleScroll = () => {
      updateProgress();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    const cleanups: Array<() => void> = [];

    if (!reduceMotion && canHover) {
      const handlePointerMove = (event: PointerEvent) => {
        root.style.setProperty("--cursor-x", `${event.clientX}px`);
        root.style.setProperty("--cursor-y", `${event.clientY}px`);
        follower?.classList.add("is-active");
      };

      const handlePointerLeave = () => {
        follower?.classList.remove("is-active");
      };

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave);

      cleanups.push(() => window.removeEventListener("pointermove", handlePointerMove));
      cleanups.push(() => window.removeEventListener("pointerleave", handlePointerLeave));

      magneticElements.forEach((element) => {
        const handleMove = (event: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          element.style.transform = `translate(${(x * 0.12).toFixed(2)}px, ${(y * 0.12).toFixed(2)}px)`;
        };

        const handleLeave = () => {
          element.style.transform = "";
        };

        element.addEventListener("mousemove", handleMove);
        element.addEventListener("mouseleave", handleLeave);

        cleanups.push(() => element.removeEventListener("mousemove", handleMove));
        cleanups.push(() => element.removeEventListener("mouseleave", handleLeave));
      });
    }

    return () => {
      revealObserver?.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return <div className="cursor-follower" aria-hidden="true" />;
}
