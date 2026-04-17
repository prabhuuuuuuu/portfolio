"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { WireframeBox } from "@/components/WireframeBox";
import { ScribbleArrow } from "@/components/ScribbleArrow";
import { StickyNote } from "@/components/StickyNote";
import { AnimatedCat } from "@/components/AnimatedCat";
import { MarginDoodle } from "@/components/MarginDoodle";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const sections = [
  { id: "hero", label: "Intro", number: "00." },
  { id: "projects", label: "Projects", number: "01." },
  { id: "experience", label: "Experience", number: "02." },
  { id: "skills", label: "Skills", number: "03." },
  { id: "contact", label: "Contact", number: "04." },
] as const;

const projects = [
  {
    title: "AI Newsroom Agent",
    eyebrow: "Editorial system",
    problem:
      "Turns research, drafting, critique, and publishing into one clear editorial workflow instead of disconnected manual steps.",
    outcome:
      "Cuts article research time by 70% through multi-agent orchestration, checkpointed state, and review gates before publish.",
    tech: ["LangGraph", "Ollama", "FastAPI", "React"],
    githubHref: "https://github.com/prabhuuuuuuu/agentic_newsroom",
    metric: "70% faster research",
  },
  {
    title: "Driver Fatigue Detection",
    eyebrow: "Edge safety",
    problem:
      "Detects eye closure, yawning, and head-pose drift early enough for edge devices to support real-time driver safety.",
    outcome:
      "Reached 95% accuracy with sub-50 ms latency and stable 30 FPS inference on Raspberry Pi hardware.",
    tech: ["TensorFlow", "OpenCV", "MobileNetV2", "Raspberry Pi"],
    githubHref: "https://github.com/prabhuuuuuuu/driver_fatigue",
    metric: "95% accuracy",
  },
  {
    title: "Waste Sorting Vision Pipeline",
    eyebrow: "Real-time classification",
    problem:
      "Automates material classification on constrained hardware so sorting decisions can happen at the edge without cloud.",
    outcome:
      "Delivered 0.87 mAP at 30 FPS by deploying a ViT + DETR pipeline through ONNX on Raspberry Pi.",
    tech: ["PyTorch", "ViT", "ONNX", "Raspberry Pi"],
    metric: "0.87 mAP at 30 FPS",
  },
];

const experience = [
  {
    role: "Computer Vision Intern",
    company: "UrbanDienst",
    dates: "Nov 2025 - Feb 2026",
    bullets: [
      "45 FPS at 22 ms latency on MemryX edge chips after quantizing YOLOv8 pipelines.",
      "Maintained sub 50 MB memory footprint while keeping real-time inference practical.",
    ],
  },
  {
    role: "AI + Robotics Intern",
    company: "IIT Mandi",
    dates: "Apr 2025 - Oct 2025",
    bullets: [
      "18% F1 improvement on limited unlabeled data by applying self-supervised learning.",
      "85% multi-terrain success from a PPO locomotion policy built for biped robotics.",
    ],
  },
  {
    role: "AI Intern",
    company: "VIT Chennai",
    dates: "Sep 2024 - Present",
    bullets: [
      "30 FPS waste sorting inference at 0.87 mAP using a ViT + DETR pipeline on Raspberry Pi.",
      "25 FPS behavioral tracking from a YOLOv8 + StrongSORT perception system.",
    ],
  },
];

const skillGroups = [
  {
    name: "core",
    items: ["Python", "PyTorch", "TensorFlow", "Computer Vision", "Multi-Agent Systems"],
  },
  {
    name: "tools",
    items: ["FastAPI", "React", "Docker", "Git", "Ollama", "ONNX"],
  },
  {
    name: "hardware",
    items: ["Raspberry Pi", "MemryX NPU", "Edge Deployments"],
  },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pranav Prashant Shewale",
  url: siteUrl,
  jobTitle: "AI Engineer and Computer Vision Researcher",
  description: "AI engineer focused on multi-agent systems, computer vision, and edge-ready products.",
  email: "mailto:pranavprashantshewale@gmail.com",
};

export default function HomePage() {
  const [konami, setKonami] = useState(false);
  
  useEffect(() => {
    console.log("// thanks for viewing the wireframe. the real build is just as messy.");
    
    // Konami code easter egg
    const konamiCode = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    let konamiIndex = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setKonami(prev => !prev);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (konami) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black font-sans">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Final Mockup Mode</h1>
          <p>This is too clean. Press Konami code again to go back to the real work.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="site-shell">
        <aside className="section-rail" aria-label="Section progress">
          <div className="section-rail__line" />
          <nav className="section-dots">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="section-dot"
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
              <a href="#hero" className="site-brand flex items-center" aria-label="Go to top of page">
                <AnimatedCat /> <span className="wiggle-on-hover mt-1">[ Pranav Shewale ]</span>
              </a>
              <nav className="site-nav" aria-label="Section navigation">
                {sections.slice(1).map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </header>

          <main className="site-main">
            <div className="content-grid">
              
              {/* HERO */}
              <section id="hero" className="section">
                <WireframeBox className="col-span-full md:col-span-12 p-8 md:p-12 relative !bg-transparent !border-0 !box-shadow-none">
                  <div className="max-w-3xl">
                    <div className="inline-block px-3 py-1 mb-4 border-2 border-dashed border-[#1a1a1a] rounded font-mono text-sm uppercase">
                      <span className="opacity-70">&lt;</span> Role: AI Engineer <span className="opacity-70">/&gt;</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tight mb-6">
                      Pranav Prashant<br/>Shewale
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-[#555] font-sans leading-relaxed max-w-2xl">
                      I build AI systems that run anywhere.<br/>
                      Engineering agentic systems and foundational AI optimized for the edge. I turn heavy architectures into lightweight, autonomous deployments. Intelligence without the cloud tether.
                    </p>
                    
                    <div className="mt-12 flex flex-wrap gap-6 items-center">
                      <StickyNote rotation={-3} className="inline-block wiggle-on-hover hover:z-10 !p-3">
                        <a href="/pranav-prashant-shewale-resume.pdf" className="font-bold underline text-lg" download>
                           Download Resume
                        </a>
                      </StickyNote>

                      <a 
                        href="/pranav-prashant-shewale-resume.pdf" 
                        target="_blank" 
                        rel="noreferrer"
                        className="button button--primary"
                      >
                        View Resume In Browser
                      </a>

                      <a href="#contact" className="font-mono underline decoration-wavy underline-offset-4 font-bold wiggle-on-hover">
                        Contact Me
                      </a>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block absolute top-[10%] right-[12%]">
                    <ScribbleArrow width={120} height={80} direction="right-down" />
                    <div className="font-mono text-sm mt-2 ml-10 transform rotate-12 opacity-80">
                      (actual systems, not toy models)
                    </div>
                  </div>

                  <MarginDoodle type="circuit" className="absolute top-[40%] right-[-40px] opacity-30 pointer-events-none" />
                  
                  <div className="hidden lg:block absolute bottom-0 right-[2%] z-10 transform scale-110 rotate-1 wiggle-on-hover hover:z-30 pointer-events-none">
                    <Image
                      src="/images/cutout.png"
                      alt="Pranav Shewale"
                      width={380}
                      height={380}
                      className="object-contain drop-shadow-[10px_10px_0px_rgba(26,26,26,0.1)]"
                      priority
                    />
                  </div>
                </WireframeBox>
              </section>

              <div className="section-divider">
                <span className="section-divider__line" />
              </div>

              {/* PROJECTS */}
              <section id="projects" className="section">
                <div className="section-aside section-aside--sticky">
                  <p className="mono-kicker">01. spec // projects</p>
                  <h2 className="section-title mb-4">Selected Works</h2>
                  <p className="font-sans text-[#555]">
                    Measurable outcomes constrained by hard logic.
                  </p>
                  <div className="hidden md:block mt-8 opacity-60">
                    <ScribbleArrow width={60} height={100} direction="down" />
                  </div>
                </div>

                <div className="section-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                      <WireframeBox key={project.title} className="p-6 flex flex-col h-full bg-[#faf9f7]">
                        <div className="flex justify-between items-start mb-4">
                          <p className="font-mono text-sm uppercase opacity-70 underline decoration-dashed underline-offset-4">{project.eyebrow}</p>
                          <div className="border border-[#1a1a1a] rounded-sm px-2 py-1 text-xs font-mono font-bold bg-[#1a1a1a] text-[#faf9f7] transform rotate-2">
                            {project.metric}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold font-mono mb-3">{project.title}</h3>
                        <p className="text-sm font-sans mb-4 flex-grow opacity-80">{project.problem}</p>
                        
                        <div className="mt-auto pt-4 border-t border-dashed border-[#1a1a1a] opacity-30" />
                        
                        <ul className="flex flex-wrap gap-2 mt-4 mb-6">
                          {project.tech.map((item) => (
                            <li key={item} className="px-2 py-1 text-xs border border-[#1a1a1a] rounded font-mono">
                              {item}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex items-center gap-4 mt-auto">
                          {project.githubHref && (
                            <a href={project.githubHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-sm underline wiggle-on-hover font-bold">
                              [ GitHub ]
                            </a>
                          )}
                          <div className="w-12 h-4 opacity-50 ml-auto">
                            <ScribbleArrow width={40} height={15} direction="right" />
                          </div>
                        </div>
                      </WireframeBox>
                    ))}
                  </div>
                </div>
              </section>

              <div className="section-divider">
                <span className="section-divider__line" />
              </div>

              {/* EXPERIENCE */}
              <section id="experience" className="section">
                <div className="col-span-full mb-6">
                  <p className="mono-kicker">02. spec // timeline</p>
                  <h2 className="section-title">Experience</h2>
                </div>
                
                <ol className="timeline">
                  {experience.map((item) => (
                    <li key={`${item.company}-${item.role}`} className="timeline-item">
                      <div className="timeline-dot" />
                      <WireframeBox className="p-6 col-span-12 md:col-span-11 bg-white">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                          <div>
                            <p className="font-mono text-sm opacity-70 underline decoration-dashed underline-offset-4">{item.company}</p>
                            <h3 className="text-xl font-bold font-mono">{item.role}</h3>
                          </div>
                          <p className="font-mono text-sm border border-[#1a1a1a] px-2 py-1 rounded inline-block bg-[#faf9f7] transform rotate-[-1deg]">{item.dates}</p>
                        </div>
                        <ul className="list-none pl-0 space-y-2 mt-4 text-[0.95rem] opacity-90 mx-3 relative">
                          {item.bullets.map((bullet, i) => (
                            <li key={i} className="relative before:content-['>'] before:absolute before:-left-4 before:font-mono before:opacity-50">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </WireframeBox>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="section-divider">
                <span className="section-divider__line" />
              </div>

              {/* SKILLS */}
              <section id="skills" className="section">
                <div className="section-aside relative">
                  <p className="mono-kicker">03. spec // stack</p>
                  <h2 className="section-title">Skills</h2>
                  <MarginDoodle type="tensor" className="absolute bottom-[-60px] left-0 opacity-40 scale-125 hidden md:block" />
                </div>

                <div className="section-body">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {skillGroups.map((group) => (
                      <WireframeBox key={group.name} className="p-6 relative">
                        <h3 className="font-mono text-lg font-bold mb-4 underline decoration-wavy underline-offset-8">
                          {group.name}
                        </h3>
                        <ul className="flex flex-col gap-3">
                          {group.items.map((item) => (
                            <li key={item} className="flex items-center gap-3">
                              <span className="w-4 h-4 border-[1.5px] border-[#1a1a1a] rounded-[2px] inline-flex items-center justify-center">
                                <span className="w-2 h-2 bg-[#1a1a1a] rounded-full scale-50 opacity-80"></span>
                              </span>
                              <span className="font-sans text-[0.95rem]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </WireframeBox>
                    ))}
                  </div>
                </div>
              </section>

              <div className="section-divider">
                <span className="section-divider__line" />
              </div>

              {/* CONTACT */}
              <section id="contact" className="section">
                <div className="col-span-full">
                  <p className="mono-kicker">04. spec // reach out</p>
                  <h2 className="section-title mb-2">Let's Connect</h2>
                </div>
                
                <div className="col-span-full md:col-span-7">
                  <WireframeBox className="p-8 transform rotate-[1deg] w-full">
                    <h3 className="font-mono font-bold text-lg mb-6 underline decoration-dashed">form.contact</h3>
                    <form className="flex flex-col gap-6 font-mono w-full" onSubmit={(e) => e.preventDefault()}>
                      <input aria-label="Name" type="text" placeholder="Name" className="p-3 border-2 border-[#1a1a1a] rounded-[2px_4px_1px_3px] bg-transparent outline-none focus:bg-white focus:shadow-[2px_2px_0_rgba(26,26,26,0.1)] transition-all w-full" />
                      <input aria-label="Email" type="email" placeholder="Email" className="p-3 border-2 border-[#1a1a1a] rounded-[3px_2px_4px_1px] bg-transparent outline-none focus:bg-white focus:shadow-[2px_2px_0_rgba(26,26,26,0.1)] transition-all w-full" />
                      <textarea aria-label="Message" placeholder="Message..." rows={4} className="p-3 border-2 border-[#1a1a1a] rounded-[1px_3px_2px_4px] bg-transparent outline-none focus:bg-white focus:shadow-[2px_2px_0_rgba(26,26,26,0.1)] transition-all resize-none w-full"></textarea>
                      <button type="button" className="button button--primary mt-4 self-start font-bold">Submit</button>
                    </form>
                  </WireframeBox>
                </div>
                
                <div className="col-span-full md:col-span-5 flex flex-col justify-center items-start md:pl-10 mt-8 md:mt-0">
                  <p className="font-mono opacity-60 text-sm mb-6">socials.json :</p>
                  <div className="flex flex-col gap-6">
                    <a href="https://www.linkedin.com/in/pranav-shewale/" target="_blank" rel="noreferrer" className="flex items-center gap-4 wiggle-on-hover">
                      <span className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center font-mono font-bold opacity-80">in</span>
                      <span className="font-mono text-lg underline decoration-dashed underline-offset-4">LinkedIn</span>
                    </a>
                    <a href="https://github.com/prabhuuuuuuu" target="_blank" rel="noreferrer" className="flex items-center gap-4 wiggle-on-hover">
                      <span className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center font-mono font-bold opacity-80 pr-[1px] pb-[2px]">{">"}</span>
                      <span className="font-mono text-lg underline decoration-dashed underline-offset-4">GitHub</span>
                    </a>
                  </div>
                </div>
              </section>

              <footer className="site-footer mt-12 w-full">
                <p>{"{"} "copyright": "2026 Pranav Prashant Shewale" {"}"}</p>
                <p>{"{"} "stack": "Next.js + RoughJS wireframe aesthetic" {"}"}</p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
