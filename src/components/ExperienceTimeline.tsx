"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/portfolio-data";
import { EASE_IN_OUT_QUART, viewportOnce } from "@/lib/motion";
import { nowMonth, toMonth } from "@/lib/experience-dates";

type Props = {
  items: Experience[];
  active: number | null;
  onActive: (index: number | null) => void;
};

/**
 * Gantt-style track of every role laid out on a shared month axis.
 * Bars draw in on scroll; hovering a bar or its card highlights both.
 */
export function ExperienceTimeline({ items, active, onActive }: Props) {
  const { rows, ticks, nowPct } = useMemo(() => {
    const nowM = nowMonth();

    const starts = items.map((i) => toMonth(i.start));
    const ends = items.map((i) => (i.end ? toMonth(i.end) : nowM));
    const min = Math.min(...starts);
    const max = Math.max(...ends, nowM) + 1; // pad one month past "now"
    const span = Math.max(1, max - min);
    const pct = (m: number) => ((m - min) / span) * 100;

    const rows = items.map((item, i) => ({
      item,
      index: i,
      left: pct(starts[i]),
      width: Math.max(pct(ends[i] + 1) - pct(starts[i]), 2.5),
      current: !item.end,
    }));

    // One tick per January inside the domain, plus the domain start.
    const ticks: { pct: number; label: string }[] = [];
    for (let m = min; m <= max; m++) {
      if (m % 12 === 0) ticks.push({ pct: pct(m), label: String(m / 12) });
    }
    if (ticks.length === 0 || ticks[0].pct > 6) {
      ticks.unshift({ pct: 0, label: String(Math.floor(min / 12)) });
    }

    return { rows, ticks, nowPct: pct(nowM) };
  }, [items]);

  return (
    <motion.div
      className="xp-timeline"
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
    >
      <div className="xp-timeline__axis">
        {ticks.map((t) => (
          <span key={t.label} className="xp-timeline__tick" style={{ left: `${t.pct}%` }}>
            <em>{t.label}</em>
          </span>
        ))}
        <span className="xp-timeline__now" style={{ left: `${nowPct}%` }}>
          <em>now</em>
        </span>
      </div>

      <div className="xp-timeline__rows">
        {rows.map((r) => {
          const isActive = active === r.index;
          const dimmed = active !== null && !isActive;
          return (
            <div
              key={r.item.company}
              className="xp-timeline__row"
              data-active={isActive || undefined}
              data-dimmed={dimmed || undefined}
              onMouseEnter={() => onActive(r.index)}
              onMouseLeave={() => onActive(null)}
            >
              <span className="xp-timeline__label">{r.item.company}</span>
              <div className="xp-timeline__track">
                <motion.span
                  className={`xp-timeline__bar${r.current ? " is-current" : ""}`}
                  style={{ left: `${r.left}%`, width: `${r.width}%`, originX: 0 }}
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 0.9, ease: EASE_IN_OUT_QUART } },
                  }}
                >
                  {r.current && <span className="xp-timeline__pulse" />}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
