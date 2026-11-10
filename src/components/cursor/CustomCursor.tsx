"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/lib/use-media-query";

export type CursorState = "default" | "view" | "crosshair" | "link" | "hidden";

type Ctx = { state: CursorState; setState: (s: CursorState) => void };
const CursorContext = createContext<Ctx>({ state: "default", setState: () => {} });

export const useCursor = () => useContext(CursorContext);

/**
 * Wrap the app. Elements opt into states declaratively with
 * `data-cursor="view" | "crosshair" | "link"`; components can also drive it
 * imperatively via useCursor().setState (used by the R3F canvas).
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<CursorState>("default");
  const setState = useCallback((s: CursorState) => setStateRaw(s), []);
  const value = useMemo(() => ({ state, setState }), [state, setState]);

  return (
    <CursorContext.Provider value={value}>
      {children}
      <Cursor />
    </CursorContext.Provider>
  );
}

const RING: Record<CursorState, { size: number; opacity: number; border: number }> = {
  default: { size: 34, opacity: 0.7, border: 1 },
  link: { size: 14, opacity: 1, border: 1 },
  view: { size: 88, opacity: 1, border: 1 },
  crosshair: { size: 28, opacity: 1, border: 0 },
  hidden: { size: 0, opacity: 0, border: 0 },
};

function Cursor() {
  const { state, setState } = useCursor();
  const pathname = usePathname();
  // The admin editor needs the native cursor (text selection, drag, inputs).
  const enabled = useMediaQuery("(pointer: fine)") && !pathname.startsWith("/admin");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Dot snaps, ring lags: two spring configs.
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  // Hide the native cursor only when the custom one is actually rendering.
  useEffect(() => {
    document.documentElement.classList.toggle("has-custom-cursor", enabled);
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    // Delegated hover detection for data-cursor / interactive elements.
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        setState((tagged.dataset.cursor as CursorState) ?? "default");
        return;
      }
      if (t.closest("a, button, [role=button], input, textarea, label")) {
        setState("link");
        return;
      }
      setState("default");
    };

    const onLeaveWindow = () => setState("hidden");
    const onEnterWindow = () => setState("default");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
    };
  }, [enabled, setState, x, y]);

  if (!enabled) return null;

  const ring = RING[state];

  return (
    <div className="cursor" aria-hidden>
      {/* Dot follows raw pointer */}
      <motion.div
        className="cursor__dot"
        style={{ x, y }}
        animate={{ scale: state === "crosshair" || state === "hidden" ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      {/* Ring lags on a spring and morphs per state */}
      <motion.div
        className="cursor__ring"
        style={{ x: rx, y: ry }}
        animate={{
          width: ring.size,
          height: ring.size,
          opacity: ring.opacity,
          borderWidth: ring.border,
          borderRadius: state === "crosshair" ? "0%" : "50%",
          rotate: state === "crosshair" ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.6 }}
      >
        <motion.span
          className="cursor__label"
          animate={{ opacity: state === "view" ? 1 : 0, scale: state === "view" ? 1 : 0.7 }}
          transition={{ duration: 0.25 }}
        >
          view
        </motion.span>
        <motion.span
          className="cursor__cross"
          animate={{ opacity: state === "crosshair" ? 1 : 0, rotate: state === "crosshair" ? -45 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>
    </div>
  );
}
