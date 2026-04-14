"use client";

import { useEffect, useState } from "react";
import { Mail, Workflow } from "lucide-react";
import { introSequence } from "./data";
import { Panel } from "./Panel";

export function HeroPanel() {
  const [typedIntro, setTypedIntro] = useState(() => introSequence.map(() => ""));
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    let totalDelay = 0;

    introSequence.forEach((line, lineIndex) => {
      for (let index = 1; index <= line.length; index += 1) {
        timers.push(
          setTimeout(() => {
            setTypedIntro((current) => {
              const next = [...current];
              next[lineIndex] = line.slice(0, index);
              return next;
            });
          }, totalDelay + index * 34)
        );
      }

      totalDelay += line.length * 34 + 260;
    });

    timers.push(setTimeout(() => setBootComplete(true), totalDelay));
    return () => timers.forEach(clearTimeout);
  }, []);

  const activeLineIndex = bootComplete
    ? introSequence.length - 1
    : typedIntro.findIndex((line, index) => line.length < introSequence[index].length);

  return (
    <Panel className="hero-panel">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="status-pill">
            <span className="status-pill__dot" />
            AVAILABLE FOR HIGH-LEVERAGE BUILDS
          </span>
          <span className="status-chip">Chennai, India</span>
          <span className="status-chip">AI systems + edge vision</span>
        </div>

        <div className="hero-boot rounded-2xl border border-slate-900 bg-[#04070d] p-5">
          {introSequence.map((line, index) => {
            const isActive =
              index === (activeLineIndex === -1 ? introSequence.length - 1 : activeLineIndex);

            return (
              <div
                key={line}
                className="font-mono text-sm uppercase tracking-[0.28em] text-slate-400"
              >
                <span>{typedIntro[index] || "\u00a0"}</span>
                {isActive ? <span className="type-cursor" /> : null}
              </div>
            );
          })}
        </div>

        <div className="hero-copy">
          <p className="panel-kicker">PROFILE</p>
          <h1 className="mt-4 max-w-5xl font-mono text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pranav Prashant Shewale
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg">
            I build AI systems that run anywhere. I engineer agentic systems and foundational AI
            optimized for the edge, turning heavy architectures into lightweight, autonomous
            deployments. Intelligence without the cloud tether.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="#projects" className="build-button">
            <Workflow className="h-4 w-4" />
            PROJECTS
          </a>
          <a href="#contact" className="ghost-button">
            <Mail className="h-4 w-4" />
            CONTACT
          </a>
        </div>
      </div>
    </Panel>
  );
}
