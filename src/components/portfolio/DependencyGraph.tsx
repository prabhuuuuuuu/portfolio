"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { graphLinks, graphNodes } from "./data";
import { Panel } from "./Panel";

export function DependencyGraphCard() {
  return (
    <Panel id="stack" className="lg:col-span-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="panel-kicker">DEPENDENCY GRAPH</p>
          <h2 className="mt-3 font-mono text-2xl font-semibold text-white">Stack topology</h2>
        </div>
        <Network className="h-5 w-5 text-[var(--accent-green)]" />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">
        Skills are framed as connected systems rather than isolated badges: mobile surface,
        orchestration engine, model runtime, and production APIs all feeding the same build loop.
      </p>

      <div className="graph-surface mt-6">
        <svg viewBox="0 0 100 100" className="graph-lines" aria-hidden>
          {graphLinks.map(([source, target]) => {
            const sourceNode = graphNodes.find((node) => node.id === source);
            const targetNode = graphNodes.find((node) => node.id === target);

            if (!sourceNode || !targetNode) return null;

            return (
              <motion.line
                key={`${source}-${target}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="rgba(80, 96, 124, 0.65)"
                strokeWidth="0.55"
                initial={{ opacity: 0.18 }}
                animate={{ opacity: [0.18, 0.42, 0.18] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: (sourceNode.x + targetNode.y) / 100,
                }}
              />
            );
          })}
        </svg>

        {graphNodes.map((node, index) => (
          <motion.div
            key={node.id}
            className={`graph-node graph-node--${node.tone ?? "cyan"}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0.75, scale: 0.96 }}
            animate={{ opacity: [0.72, 1, 0.78], scale: [0.96, 1.02, 0.96] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatType: "mirror",
              delay: index * 0.18,
            }}
          >
            {node.label}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="legend-chip legend-chip--cyan">AI orchestration</span>
        <span className="legend-chip legend-chip--orange">App surface</span>
        <span className="legend-chip legend-chip--green">Production runtime</span>
      </div>
    </Panel>
  );
}
