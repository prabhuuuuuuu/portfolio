"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  Download,
  Eye,
  FileText,
  Github,
  Linkedin,
  Mail,
  Server,
  Workflow,
} from "lucide-react";
import { HeroPanel } from "@/components/portfolio/HeroPanel";
import { MetricPill, Panel, containerVariants } from "@/components/portfolio/Panel";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { experience, featuredNewsroom, quickStats, systems } from "@/components/portfolio/data";

const projectCards = [featuredNewsroom, ...systems];
const stackGroups = [
  ["Python", "LangGraph", "LangChain", "Ollama", "FastAPI"],
  ["PyTorch", "TensorFlow", "YOLOv8", "ViT", "DETR"],
  ["OpenCV", "StrongSORT", "Raspberry Pi", "MemryX", "Docker"],
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-slate-100">
      <div className="dashboard-background" aria-hidden />

      <header className="sticky top-0 z-30 border-b border-slate-900/80 bg-[rgba(4,6,10,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 font-mono text-sm font-semibold tracking-[0.24em] text-[var(--accent-cyan)]">
              PPS
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.34em] text-slate-500">
                Intelligent Dashboard
              </p>
              <p className="text-sm text-slate-300">AI Engineer &amp; CV Researcher</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {[
              { href: "#projects", label: "Projects" },
              { href: "#publications", label: "Publications" },
              { href: "#experience", label: "Experience" },
              { href: "#stack", label: "Stack" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="nav-chip">
                {item.label}
              </a>
            ))}
          </nav>

          <a href="/pranav-prashant-shewale-resume.pdf" download className="build-button hidden md:inline-flex">
            <Download className="h-4 w-4" />
            DOWNLOAD_RESUME
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <motion.div className="flex flex-col gap-6" initial="hidden" animate="visible" variants={containerVariants}>
          <HeroPanel />

          <Panel>
            <div>
              <p className="panel-kicker">PROFILE SNAPSHOT</p>
              <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
                Engineering scope at a glance
              </h2>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((metric) => (
                <MetricPill key={metric.label} metric={metric} />
              ))}
            </div>
          </Panel>

          <Panel id="projects">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-kicker">PROJECTS</p>
                <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
                  Selected systems and applied engineering work
                </h2>
              </div>
              <Workflow className="h-5 w-5 text-[var(--accent-cyan)]" />
            </div>

            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
              A mix of multi-agent orchestration, edge inference, computer vision, and applied
              product development, with each project framed around system behavior and measurable outcomes.
            </p>

            <motion.div variants={containerVariants} className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projectCards.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </Panel>

          <Panel id="publications">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-kicker">PUBLICATIONS</p>
                <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
                  Research and publication work
                </h2>
              </div>
              <FileText className="h-5 w-5 text-[var(--accent-cyan)]" />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-900 bg-[#05070a] p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="panel-kicker">ICVGIP 2025</p>
                  <h3 className="mt-2 font-mono text-xl font-semibold text-white">
                    TongueSight: AI-Powered Tongue Analysis for Digitizing Traditional Medicine Diagnostics
                  </h3>
                </div>
                <span className="stack-tag">Published paper</span>
              </div>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
                Co-authored and published at ICVGIP 2025, TongueSight combines YOLOv8 with
                Mask2Former, SegNet, and EfficientNet-B0 to extract five clinically relevant tongue
                features in a modular pipeline designed for mobile and edge deployment.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <MetricPill metric={{ label: "Accuracy", value: "92.0%", tone: "green" }} />
                <MetricPill metric={{ label: "Benchmark delta", value: "+2.88 pts vs TongueNet", tone: "cyan" }} />
                <MetricPill metric={{ label: "Use case", value: "5 clinical features", tone: "orange" }} />
              </div>
            </div>
          </Panel>

          <Panel id="experience">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-kicker">EXPERIENCE</p>
                <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
                  Industry, research, and deployment experience
                </h2>
              </div>
              <Briefcase className="h-5 w-5 text-[var(--accent-orange)]" />
            </div>

            <div className="mt-6 space-y-4">
              {experience.map((item) => (
                <div
                  key={`${item.company}-${item.role}`}
                  className="rounded-2xl border border-slate-900 bg-[#05070a] p-5"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                        {item.date}
                      </p>
                      <h3 className="mt-2 font-mono text-lg font-semibold text-slate-100">{item.role}</h3>
                      <p className="text-sm text-[var(--accent-cyan)]">{item.company}</p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {item.descriptions.map((description) => (
                      <li
                        key={`${item.company}-${description}`}
                        className="flex gap-3 text-sm leading-6 text-slate-300"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-cyan)]" />
                        <span>{description}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.metrics.map((metric) => (
                      <span key={`${item.company}-${metric}`} className="stack-tag">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel id="stack">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-kicker">STACK</p>
                <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
                  Core tools across orchestration, vision, and deployment
                </h2>
              </div>
              <Bot className="h-5 w-5 text-[var(--accent-green)]" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {stackGroups.map((group, index) => (
                <div key={index} className="rounded-2xl border border-slate-900 bg-[#05070a] p-5">
                  <div className="flex flex-wrap gap-2">
                    {group.map((item) => (
                      <span key={item} className="stack-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel id="resume">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="panel-kicker">RESUME</p>
                <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
                  Access the full resume
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                  Use the browser view for a quick recruiter read-through, or download the PDF for
                  offline review and sharing.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/pranav-prashant-shewale-resume.pdf" target="_blank" rel="noreferrer" className="ghost-button">
                  <Eye className="h-4 w-4" />
                  VIEW_RESUME_IN_BROWSER
                </a>
                <a href="/pranav-prashant-shewale-resume.pdf" download className="build-button">
                  <Download className="h-4 w-4" />
                  DOWNLOAD_RESUME
                </a>
              </div>
            </div>
          </Panel>

          <Panel id="contact">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-kicker">CONTACT</p>
                <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
                  Best fit for product and AI engineering roles
                </h2>
              </div>
              <Server className="h-5 w-5 text-[var(--accent-green)]" />
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              Strong fit for teams looking for an engineer who can move from research and model
              behavior to deployment, tooling, and product-facing execution without losing rigor.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <a href="mailto:pranavprashantshewale@gmail.com" className="contact-card">
                <Mail className="h-5 w-5 text-[var(--accent-cyan)]" />
                <span className="contact-card__label">Email</span>
                <span className="contact-card__value">pranavprashantshewale@gmail.com</span>
              </a>
              <a href="https://www.linkedin.com/in/pranav-shewale/" className="contact-card" target="_blank" rel="noreferrer">
                <Linkedin className="h-5 w-5 text-[var(--accent-cyan)]" />
                <span className="contact-card__label">LinkedIn</span>
                <span className="contact-card__value">/in/pranav-shewale</span>
              </a>
              <a href="https://github.com/prabhuuuuuuu" className="contact-card" target="_blank" rel="noreferrer">
                <Github className="h-5 w-5 text-[var(--accent-cyan)]" />
                <span className="contact-card__label">GitHub</span>
                <span className="contact-card__value">github.com/prabhuuuuuuu</span>
              </a>
            </div>
          </Panel>
        </motion.div>
      </main>
    </div>
  );
}
