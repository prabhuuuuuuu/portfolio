"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { experience } from "@/lib/portfolio-data";
import { fadeUp, stagger } from "@/lib/motion";
import { ExperienceLog } from "@/components/ExperienceLog";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";

export function ExperienceSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="experience">
      <motion.div
        className="section-head"
        initial="hidden"
        animate="show"
        variants={stagger(0.08, 0.2)}
      >
        <motion.p variants={fadeUp} className="label">
          01. spec // timeline
        </motion.p>
        <motion.h2 variants={fadeUp} className="display">
          Experience
        </motion.h2>
      </motion.div>

      <ExperienceTimeline items={experience} active={active} onActive={setActive} />

      <ExperienceLog items={experience} active={active} onActive={setActive} />
    </section>
  );
}
