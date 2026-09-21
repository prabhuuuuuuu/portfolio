"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { telemetry, type Telemetry } from "@/lib/portfolio-data";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Props = {
  /** How many lines are visible at once. */
  rows?: number;
  /** Ms between rotations. */
  interval?: number;
  /** Start offset into the list so multiple tickers don't sync. */
  offset?: number;
  className?: string;
  align?: "left" | "right";
  /** Override the source lines (e.g. a project card's own metric). */
  lines?: Telemetry[];
};

/**
 * Rotating monospace readout. Each row is a fixed-height slot; the line
 * inside cross-fades so the layout never shifts. Source is `telemetry`
 * in portfolio-data — every value is lifted from real content.
 */
export function TelemetryTicker({
  rows = 3,
  interval = 2600,
  offset = 0,
  className = "",
  align = "left",
  lines = telemetry,
}: Props) {
  const [head, setHead] = useState(offset % lines.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHead((h) => (h + 1) % lines.length), interval);
    return () => clearInterval(id);
  }, [interval, lines.length]);

  return (
    <div
      className={`telemetry ${className}`}
      aria-hidden
      style={{ display: "grid", gap: 6, justifyItems: align === "right" ? "end" : "start" }}
    >
      {Array.from({ length: rows }, (_, slot) => {
        const line = lines[(head + slot) % lines.length];
        return (
          <div key={slot} style={{ position: "relative", height: "1.3em", minWidth: 220, width: "100%" }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={line.key}
                initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  justifyContent: align === "right" ? "flex-end" : "flex-start",
                }}
              >
                {line.live && <span className="telemetry__dot" style={{ marginRight: 0 }} />}
                <span className="telemetry__key">{line.key}</span>
                <span className={line.live ? "telemetry__val telemetry__val--live" : "telemetry__val"}>
                  {line.value}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** Static single-line readout (used inside project cards). */
export function TelemetryLine({ k, v, live }: { k: string; v: string; live?: boolean }) {
  return (
    <span className="telemetry" style={{ display: "inline-flex", gap: 12, alignItems: "center" }}>
      {live && <span className="telemetry__dot" style={{ marginRight: 0 }} />}
      <span className="telemetry__key">{k}</span>
      <span className={live ? "telemetry__val telemetry__val--live" : "telemetry__val"}>{v}</span>
    </span>
  );
}
