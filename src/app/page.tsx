<<<<<<< HEAD
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
=======
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const sections = [
  { id: "hero", label: "Intro", number: "00." },
  { id: "projects", label: "Projects", number: "01." },
  { id: "experience", label: "Experience", number: "02." },
  { id: "skills", label: "Skills", number: "03." },
  { id: "uses", label: "Uses", number: "04." },
  { id: "contact", label: "Contact", number: "05." },
] as const;

type Project = {
  title: string;
  problem: string;
  outcome: string;
  tech: string[];
  githubHref?: string;
  liveHref?: string;
  eyebrow: string;
  metric: string;
  tone: "blue" | "purple" | "coral";
};

const projects: Project[] = [
  {
    title: "AI Newsroom Agent",
    eyebrow: "Editorial system",
    problem:
      "Turns research, drafting, critique, and publishing into one clear editorial workflow instead of a stack of disconnected manual steps.",
    outcome:
      "Cuts article research time by 70% through multi-agent orchestration, checkpointed state, and review gates before publish.",
    tech: ["LangGraph", "Ollama", "FastAPI", "LangChain", "Streamlit"],
    githubHref: "https://github.com/prabhuuuuuuu/agentic_newsroom",
    metric: "70% faster research",
    tone: "blue",
  },
  {
    title: "Driver Fatigue Detection",
    eyebrow: "Edge safety",
    problem:
      "Detects eye closure, yawning, and head-pose drift early enough for edge devices to support real-time driver safety decisions.",
    outcome:
      "Reached 95% accuracy with sub-50 ms latency and stable 30 FPS inference on Raspberry Pi hardware.",
    tech: ["TensorFlow", "OpenCV", "MobileNetV2", "dlib", "Raspberry Pi"],
    githubHref: "https://github.com/prabhuuuuuuu/driver_fatigue",
    metric: "95% accuracy",
    tone: "coral",
  },
  {
    title: "Waste Sorting Vision Pipeline",
    eyebrow: "Real-time classification",
    problem:
      "Automates material classification on constrained hardware so sorting decisions can happen at the edge without cloud dependency.",
    outcome:
      "Delivered 0.87 mAP at 30 FPS by deploying a ViT + DETR pipeline through ONNX on Raspberry Pi.",
    tech: ["PyTorch", "ViT", "DETR", "ONNX", "Raspberry Pi"],
    metric: "0.87 mAP at 30 FPS",
    tone: "purple",
  },
];

const experience = [
  {
    role: "Computer Vision Intern",
    company: "UrbanDienst",
    dates: "Nov 2025 - Feb 2026",
    tone: "blue",
    bullets: [
      "45 FPS at 22 ms latency on MemryX edge chips after quantizing YOLOv8 pipelines for PPE, traffic, and pose monitoring.",
      "Under 50 MB memory footprint while keeping real-time inference practical for production-style deployment constraints.",
    ],
  },
  {
    role: "AI + Robotics Intern",
    company: "IIT Mandi",
    dates: "Apr 2025 - Oct 2025",
    tone: "purple",
    bullets: [
      "18% F1 improvement on limited unlabeled data by applying self-supervised learning to a constrained research setting.",
      "85% multi-terrain success from a PPO locomotion policy built for biped robotics experiments and checkpointed training runs.",
    ],
  },
  {
    role: "AI Intern",
    company: "VIT Chennai",
    dates: "Sep 2024 - Present",
    tone: "coral",
    bullets: [
      "30 FPS waste sorting inference at 0.87 mAP after deploying a ViT + DETR pipeline to Raspberry Pi with ONNX.",
      "25 FPS behavioral tracking from a YOLOv8 + StrongSORT perception system measuring speed and lane-discipline signals in real time.",
    ],
  },
] as const;

const skillGroups = [
  {
    name: "ml",
    items: ["PyTorch", "TensorFlow", "YOLOv8", "ViT", "DETR", "Mask2Former", "OpenCV"],
  },
  {
    name: "backend",
    items: ["Python", "FastAPI", "SQL", "WebSockets", "LangGraph", "LangChain", "RAG"],
  },
  {
    name: "tools",
    items: ["Docker", "Git", "Ollama", "Streamlit", "Raspberry Pi", "MemryX", "ONNX"],
  },
] as const;

const uses = [
  {
    title: "Dev setup",
    body: "Next.js for the front-end shell, FastAPI for APIs, and Ollama when I want local model runs without extra cloud overhead.",
    items: ["Next.js", "FastAPI", "Ollama", "GitHub"],
  },
  {
    title: "Edge lab",
    body: "Most experiments stay close to deployment reality, so Raspberry Pi, ONNX, MemryX, and camera-first CV tooling show up often.",
    items: ["Raspberry Pi", "ONNX", "MemryX", "OpenCV"],
  },
  {
    title: "Workflow",
    body: "I like lightweight systems that make iteration fast: clean dashboards, measurable checkpoints, and tools that stay easy to reason about.",
    items: ["LangGraph", "Streamlit", "Docker", "Metrics-first"],
  },
] as const;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pranav Prashant Shewale",
  url: siteUrl,
  image: `${siteUrl}/images/cutout.png`,
  jobTitle: "AI Engineer and Computer Vision Researcher",
  description:
    "AI engineer focused on multi-agent systems, computer vision, and edge-ready products with measurable outcomes.",
  email: "mailto:pranavprashantshewale@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressCountry: "India",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Vellore Institute of Technology, Chennai Campus",
  },
  sameAs: [
    "https://www.linkedin.com/in/pranav-shewale/",
    "https://github.com/prabhuuuuuuu",
  ],
  knowsAbout: [
    "Multi-agent systems",
    "Computer vision",
    "Edge AI",
    "FastAPI",
    "LangGraph",
    "Deep learning",
  ],
};

function renderWordLine(text: string, delayBase = 0) {
  return (
    <span className="word-line" aria-hidden="true">
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="word-mask">
          <span className="word" style={{ animationDelay: `${delayBase + index * 60}ms` }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <span className="section-divider__line" />
      <span className="section-divider__marker section-divider__marker--diamond" />
      <span className="section-divider__marker section-divider__marker--dot" />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <noscript>
        <style>{`[data-reveal], .word { opacity:1 !important; transform:none !important; }`}</style>
      </noscript>

      <div className="site-shell">
        <div className="mesh-layer" aria-hidden="true">
          <div className="mesh-orb mesh-orb--blue" />
          <div className="mesh-orb mesh-orb--purple" />
          <div className="mesh-orb mesh-orb--black" />
        </div>

        <aside className="section-rail" aria-label="Section progress">
          <div className="section-rail__line" />
          <nav className="section-dots">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="section-dot"
                data-nav-dot={section.id}
                aria-label={section.label}
              >
                <span />
                <em>{section.number}</em>
              </a>
            ))}
          </nav>
        </aside>

        <div className="page-frame">
          <header className="site-header">
            <div className="site-header__inner">
              <a href="#hero" className="site-brand" aria-label="Go to top of page">
                Pranav Shewale
              </a>
              <nav className="site-nav" aria-label="Section navigation">
                {sections.slice(1).map((section) => (
                  <a key={section.id} href={`#${section.id}`} data-nav-link={section.id}>
                    {section.label}
                  </a>
                ))}
                <a
                  href="/pranav-prashant-shewale-resume.pdf"
                  download
                  className="site-nav__resume"
                >
                  Resume
                </a>
              </nav>
            </div>
          </header>

          <main className="site-main">
            <div className="content-grid">
              <section id="hero" className="section section--hero" data-section>
                <div className="hero-panel">
                  <div className="hero-copy">
                    <p className="eyebrow eyebrow--accent">00. Intro</p>
                    <h1 aria-label="Pranav Prashant Shewale">
                      {renderWordLine("Pranav Prashant", 0)}
                      {renderWordLine("Shewale", 120)}
                    </h1>
                    <p className="hero-role">i build ai systems that run anywhere.</p>
                    <p className="hero-summary">
                      engineering agentic systems and foundational ai optimized for the edge. i
                      turn heavy architectures into lightweight, autonomous deployments.
                      intelligence without the cloud tether.
                    </p>
                    <div className="button-row">
                      <a
                        href="/pranav-prashant-shewale-resume.pdf"
                        download
                        className="button button--primary"
                        data-magnetic
                      >
                        Download resume
                      </a>
                      <a href="#contact" className="button button--secondary">
                        Contact
                      </a>
                    </div>
                  </div>

                  <div className="hero-avatar">
                    <div className="avatar-frame">
                      <Image
                        src="/images/cutout.png"
                        alt="Portrait of Pranav Prashant Shewale"
                        width={240}
                        height={240}
                        priority
                      />
                    </div>
                  </div>
                </div>
              </section>

              <SectionDivider />

              <section id="projects" className="section section--projects" data-section>
                <div className="section-aside section-aside--sticky" data-reveal>
                  <p className="eyebrow eyebrow--accent">01. Projects</p>
                  <h2 className="section-title">Selected systems with measurable outcomes</h2>
                </div>

                <div className="section-body">
                  <div className="project-grid">
                    {projects.map((project, index) => (
                      <article
                        key={project.title}
                        className={`project-card card ${
                          index === 0 ? "project-card--featured" : ""
                        } tone-${project.tone}`}
                        data-reveal
                        style={{ ["--reveal-delay" as string]: `${index * 100}ms` }}
                      >
                        <div className="project-meta">
                          <p className="mono-kicker">{project.eyebrow}</p>
                          <span className="project-metric">{project.metric}</span>
                        </div>

                        <div className="card-stack">
                          <h3>{project.title}</h3>
                          <p>{project.problem}</p>
                          <p className="project-outcome">{project.outcome}</p>
                        </div>
                        <ul className="tag-list" aria-label={`${project.title} technologies`}>
                          {project.tech.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <div className="link-row">
                          {project.githubHref ? (
                            <a href={project.githubHref} target="_blank" rel="noreferrer">
                              GitHub
                            </a>
                          ) : (
                            <span className="link-row__muted">Private build</span>
                          )}
                          {project.liveHref ? (
                            <a href={project.liveHref} target="_blank" rel="noreferrer">
                              Live
                            </a>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <SectionDivider />

              <section id="experience" className="section section--experience" data-section>
                <div className="section-header-full" data-reveal>
                  <p className="eyebrow eyebrow--accent">02. Experience</p>
                  <h2 className="section-title">Experience</h2>
                </div>
                <ol className="timeline timeline--full">
                  {experience.map((item, index) => (
                    <li
                      key={`${item.company}-${item.role}`}
                      className={`timeline-item timeline-item--${item.tone}`}
                      data-reveal
                      style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
                    >
                      <div className="timeline-dot" />
                      <div className="timeline-card card">
                        <div className="timeline-row">
                          <div>
                            <p className="mono-kicker">{item.company}</p>
                            <h3 className="timeline-title">{item.role}</h3>
                          </div>
                          <p className="timeline-date">{item.dates}</p>
                        </div>
                        <ul className="timeline-points">
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <SectionDivider />

              <section id="skills" className="section section--skills" data-section>
                <div className="section-aside" data-reveal>
                  <p className="eyebrow eyebrow--accent">03. Skills</p>
                  <h2 className="section-title">Grouped by the work they help me finish</h2>
                </div>

                <div className="section-body">
                  <div className="skills-grid">
                    {skillGroups.map((group, index) => (
                      <section
                        key={group.name}
                        className="card skill-group"
                        data-reveal
                        aria-labelledby={`${group.name}-title`}
                        style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}
                      >
                        <p className="mono-kicker">group</p>
                        <h3 id={`${group.name}-title`}>{group.name}</h3>
                        <ul className="tag-list">
                          {group.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              </section>

              <SectionDivider />

              <section id="uses" className="section section--uses" data-section>
                <div className="section-aside" data-reveal>
                  <p className="eyebrow eyebrow--accent">04. Uses</p>
                  <h2 className="section-title">The setup behind the work</h2>
                  <p className="section-copy">
                    A few tools and habits that show up repeatedly when I build, test, and ship.
                  </p>
                </div>

                <div className="section-body">
                  <div className="uses-grid">
                    {uses.map((item, index) => (
                      <article
                        key={item.title}
                        className="card uses-card"
                        data-reveal
                        style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}
                      >
                        <p className="mono-kicker">{String(index + 1).padStart(2, "0")}</p>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                        <ul className="tag-list">
                          {item.items.map((use) => (
                            <li key={use}>{use}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <SectionDivider />

              <section id="contact" className="section section--contact" data-section>
                <div className="contact-block" data-reveal>
                  <p className="eyebrow eyebrow--accent">05. Contact</p>
                  <h2 className="section-title">
                    Open to applied AI, platform, and product-facing engineering work
                  </h2>
                  <a className="contact-email" href="mailto:pranavprashantshewale@gmail.com">
                    pranavprashantshewale@gmail.com
                  </a>
                  <div className="contact-links">
                    <a href="https://www.linkedin.com/in/pranav-shewale/" target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                    <a href="https://github.com/prabhuuuuuuu" target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                    <a href="/pranav-prashant-shewale-resume.pdf" download>
                      Resume
                    </a>
                  </div>
                </div>
              </section>

              <footer className="site-footer">
                <p>© 2026 Pranav Prashant Shewale</p>
                <p>Built with Next.js</p>
              </footer>
            </div>
          </main>
        </div>
      </div>

      <ScrollReveal />
    </>
  );
}
>>>>>>> main
