"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { sections, personSchema } from "@/lib/portfolio-data";
import { Magnetic } from "@/components/motion/Magnetic";
import { TelemetryTicker } from "@/components/TelemetryTicker";
import { EASE_OUT_EXPO } from "@/lib/motion";

const FieldBackground = dynamic(
  () => import("@/components/three/FieldBackground").then((m) => m.FieldBackground),
  { ssr: false },
);

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [konami, setKonami] = useState(false);

  useEffect(() => {
    console.log("// thanks for viewing the wireframe. the real build is just as messy.");

    // Konami code easter egg
    const konamiCode = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setKonami(prev => !prev);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // The admin is a private tool, not part of the public site chrome.
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  if (konami) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black font-sans">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Final Mockup Mode</h1>
          <p>This is too clean. Press Konami code again to go back to the real work.</p>
        </div>
      </div>
    );
  }

  const current = sections.find((s) => isActiveRoute(pathname, s.href)) ?? sections[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <FieldBackground />
      <div className="blueprint" aria-hidden />

      {/* Vertical edge readouts */}
      <div className="edge-telemetry edge-telemetry--left telemetry" aria-hidden>
        <span className="telemetry__key">SEC {current.number.replace(".", "")}</span>
        <span style={{ margin: "0 14px", color: "var(--line-strong)" }}>/</span>
        <span className="telemetry__val">{current.label}</span>
      </div>
      <div className="edge-telemetry edge-telemetry--right telemetry" aria-hidden>
        <span className="telemetry__key">PRANAV PRASHANT SHEWALE</span>
        <span style={{ margin: "0 14px", color: "var(--line-strong)" }}>/</span>
        <span className="telemetry__val telemetry__val--live">PHYSICAL AI</span>
      </div>

      <div className="site-shell">
        <header className="site-header">
          <div className="frame site-header__inner">
            <Magnetic strength={0.2}>
              <Link href="/" className="label" style={{ color: "var(--text)", display: "inline-flex", alignItems: "center", gap: 10 }} aria-label="Go to home page">
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    background: "var(--accent)",
                    boxShadow: "0 0 12px rgba(var(--accent-rgb),0.7)",
                    borderRadius: 1,
                  }}
                />
                Pranav Shewale
              </Link>
            </Magnetic>

            <nav className="site-nav" aria-label="Site navigation">
              {sections.slice(1).map((section) => {
                const active = isActiveRoute(pathname, section.href);
                return (
                  <Magnetic key={section.id} strength={0.18}>
                    <Link
                      href={section.href}
                      className={active ? "is-active" : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      <em>{section.number}</em>
                      {section.label}
                    </Link>
                  </Magnetic>
                );
              })}
            </nav>

            <div style={{ justifySelf: "end" }}>
              <TelemetryTicker rows={1} interval={3200} offset={0} align="right" />
            </div>
          </div>
        </header>

        <main className="site-main">
          <div className="frame">{children}</div>
        </main>

        <footer className="frame site-footer">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            {'{ "copyright": "2026 Pranav Prashant Shewale" }'}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
          >
            {'{ "stack": "Next.js + React Three Fiber + Framer Motion" }'}
          </motion.p>
        </footer>
      </div>
    </>
  );
}
