"use client";

import { useMemo, useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import type { Experience } from "@/lib/portfolio-data";
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { durationMonths, formatDuration, nowMonth } from "@/lib/experience-dates";
import { TelemetryLine } from "@/components/TelemetryTicker";

type Props = {
  items: Experience[];
  active: number | null;
  onActive: (index: number | null) => void;
};

/**
 * Sequential log of roles. A spine on the left fills as the list scrolls
 * into view; each entry gets a node on the spine, a meta column, and a
 * full-width panel with pointer glow, a scanline, and a duration meter.
 */
export function ExperienceLog({ items, active, onActive }: Props) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 62%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  const { durations, maxDuration } = useMemo(() => {
    const now = nowMonth();
    const durations = items.map((i) => durationMonths(i, now));
    return { durations, maxDuration: Math.max(...durations) };
  }, [items]);

  return (
    <ol className="xp-log" ref={ref}>
      <span className="xp-log__spine" aria-hidden>
        <motion.span className="xp-log__spine-fill" style={{ scaleY: fill, originY: 0 }} />
      </span>

      {items.map((item, i) => (
        <ExperienceEntry
          key={item.company}
          item={item}
          index={i}
          total={items.length}
          months={durations[i]}
          meter={durations[i] / maxDuration}
          active={active === i}
          onActive={onActive}
        />
      ))}
    </ol>
  );
}

type EntryProps = {
  item: Experience;
  index: number;
  total: number;
  months: number;
  /** 0..1 share of the longest role, drives the duration meter width. */
  meter: number;
  active: boolean;
  onActive: (index: number | null) => void;
};

function ExperienceEntry({ item, index, total, months, meter, active, onActive }: EntryProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const num = String(index + 1).padStart(2, "0");
  const current = !item.end;

  return (
    <motion.li
      className={[
        "xp-entry",
        item.featured ? "xp-entry--featured" : "",
        current ? "is-current" : "",
        active ? "is-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger(0.07)}
      onMouseEnter={() => onActive(index)}
      onMouseLeave={() => onActive(null)}
    >
      {/* Node on the spine */}
      <motion.span
        className="xp-entry__node"
        aria-hidden
        variants={{
          hidden: { scale: 0, opacity: 0 },
          show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
        }}
      >
        {current && <span className="xp-entry__node-pulse" />}
      </motion.span>

      {/* Connector from spine to panel */}
      <motion.span
        className="xp-entry__connector"
        aria-hidden
        variants={{
          hidden: { scaleX: 0, originX: 0 },
          show: { scaleX: 1, originX: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
        }}
      />

      <motion.div className="xp-entry__meta" variants={fadeUp}>
        <span className="xp-entry__index">
          {num} <span style={{ color: "var(--line-strong)" }}>/</span> {String(total).padStart(2, "0")}
        </span>
        <span className="xp-entry__dates">
          {current && <span className="telemetry__dot" style={{ marginRight: 0 }} />}
          {item.dates}
        </span>
        <span className="xp-entry__kind">{item.kind}</span>
      </motion.div>

      <motion.div
        ref={panelRef}
        className="xp-entry__panel"
        data-cursor="view"
        variants={fadeUp}
        onMouseMove={onMove}
        style={{
          // @ts-expect-error CSS custom properties are fine on MotionStyle
          "--mx": glowX,
          "--my": glowY,
        }}
      >
        <span className="xp-entry__glow" aria-hidden />
        <span className="xp-entry__scan" aria-hidden />

        <header className="xp-entry__head">
          <div>
            <p className="xp-entry__company">{item.company}</p>
            <h3 className="xp-entry__role">{item.role}</h3>
          </div>
          <span className="xp-entry__metric">{item.metric}</span>
        </header>

        <div className="xp-entry__body">
          <ul className="xp-entry__bullets">
            {item.bullets.map((bullet, b) => (
              <li key={b}>{bullet}</li>
            ))}
          </ul>

          <aside className="xp-entry__side" aria-label="Role duration">
            <span className="xp-entry__side-label">
              Duration <em>{formatDuration(months)}</em>
            </span>
            <span className="xp-entry__meter">
              <motion.span
                className="xp-entry__meter-fill"
                style={{ originX: 0 }}
                variants={{
                  hidden: { scaleX: 0 },
                  show: { scaleX: meter, transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 } },
                }}
              />
            </span>
            <span className="xp-entry__side-label">
              Status <em>{current ? "active" : "complete"}</em>
            </span>
          </aside>
        </div>

        <footer className="xp-entry__foot">
          <ul className="xp-entry__tags">
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="xp-entry__foot-right">
            {item.siteHref && (
              <a href={item.siteHref} target="_blank" rel="noreferrer" className="xp-entry__link">
                {item.siteLabel ?? "Site"} →
              </a>
            )}
            {item.paperHref && (
              <a href={item.paperHref} target="_blank" rel="noreferrer" className="xp-entry__link">
                {item.paperLabel ?? "Paper"}
              </a>
            )}
            <TelemetryLine k={item.telemetryKey} v={current ? "ACTIVE" : item.metric} live={current} />
          </div>
        </footer>
      </motion.div>
    </motion.li>
  );
}
