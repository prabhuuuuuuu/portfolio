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
