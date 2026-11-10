"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeUp, lineMask, stagger, wipeX } from "@/lib/motion";
import { socials } from "@/lib/portfolio-data";
import { Magnetic } from "@/components/motion/Magnetic";
import { TelemetryTicker } from "@/components/TelemetryTicker";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

function MaskedLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
      <motion.span variants={lineMask} style={{ display: "block" }} className={className}>
        {children}
      </motion.span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section id="hero" className="hero">
      {/* Interactive tactile sensor array */}
      <motion.div
        className="hero__canvas"
        data-cursor="crosshair"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <span className="hero__corner hero__corner--tl" />
        <span className="hero__corner hero__corner--tr" />
        <span className="hero__corner hero__corner--bl" />
        <span className="hero__corner hero__corner--br" />
        <HeroCanvas />

        <div className="hero__readout">
          <TelemetryTicker rows={3} interval={2400} offset={1} align="right" />
        </div>

        <div className="hero__portrait">
          <Image
            src="/images/cutout.png"
            alt="Pranav Shewale"
            width={380}
            height={380}
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        className="hero__copy"
        initial="hidden"
        animate="show"
        variants={stagger(0.1, 0.15)}
      >
        <motion.p variants={fadeUp} className="label" style={{ marginBottom: 28 }}>
          <span style={{ color: "var(--dim)" }}>&lt;</span> Role: Co-Founder + Physical AI Researcher + BTech CS Student, VIT Chennai{" "}
          <span style={{ color: "var(--dim)" }}>/&gt;</span>
        </motion.p>

        <h1 className="display hero__title">
          <MaskedLine>Pranav Prashant</MaskedLine>
          <MaskedLine className="thin">Shewale</MaskedLine>
        </h1>

        <motion.div variants={wipeX} className="hairline" style={{ margin: "36px 0 28px", maxWidth: 480 }} />

        <motion.p variants={fadeUp} className="hero__intro">
          I work on how intelligence gets a body, tactile sensing, sim-to-real reinforcement learning, and perception systems for robots that have to act in the real world, not just describe it.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ marginTop: 44, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}
        >
          <Magnetic>
            <a href="/pranav-prashant-shewale-resume.pdf" className="btn btn--accent" download>
              <span className="btn__tick" />
              <span>Download Resume</span>
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="/pranav-prashant-shewale-resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              <span>View Resume In Browser</span>
            </a>
          </Magnetic>

          <Magnetic strength={0.25}>
            <Link href="/contact" className="btn btn--ghost">
              <span>Contact Me</span>
              <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </motion.div>

        <motion.ul variants={fadeUp} className="hero__socials" aria-label="Social links">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noreferrer" : undefined}
                data-cursor="link"
              >
                <em>{s.glyph}</em>
                <span>{s.handle}</span>
                <span aria-hidden>{s.external ? "↗" : "→"}</span>
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
