"use client";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { WireframeBox } from "@/components/WireframeBox";
import { ScribbleArrow } from "@/components/ScribbleArrow";
import { StickyNote } from "@/components/StickyNote";
import { AnimatedCat } from "@/components/AnimatedCat";
import { MarginDoodle } from "@/components/MarginDoodle";
import { sections, projects, experience, skillGroups, personSchema } from "@/lib/portfolio-data";

export default function HomePage() {
  const [konami, setKonami] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactMessage, setContactMessage] = useState("");
  
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

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setContactStatus("sending");
    setContactMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Message could not be sent.");
      }

      form.reset();
      setContactStatus("success");
      setContactMessage("Message sent. I will reply soon.");
    } catch (error) {
      setContactStatus("error");
      setContactMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  };

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
                    <div className="inline-block px-3 py-1 mb-4 border-2 border-dashed border-[color:var(--ink)] rounded font-mono text-sm uppercase">
                      <span className="opacity-70">&lt;</span> Role: Co-Founder + AI Engineer <span className="opacity-70">/&gt;</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tight mb-6">
                      Pranav Prashant<br/>Shewale
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-[var(--muted)] font-sans leading-relaxed max-w-2xl">
                      I build AI systems that run anywhere.<br/>
                      Engineering LLM agents, physical AI perception, and foundational vision systems optimized for the edge. I turn heavy architectures into lightweight, autonomous deployments. Intelligence without the cloud tether.
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
                      className="object-contain drop-shadow-[10px_10px_0px_rgba(var(--shadow-rgb),0.1)]"
                      priority
                    />
                  </div>
                </WireframeBox>
              </section>

              <div className="section-divider">
                <span className="section-divider__line" />
              </div>

              {/* EXPERIENCE */}
              <section id="experience" className="section">
                <div className="col-span-full mb-6">
                  <p className="mono-kicker">01. spec // timeline</p>
                  <h2 className="section-title">Experience</h2>
                </div>
                
                <ol className="timeline">
                  {experience.map((item) => (
                    <li key={`${item.company}-${item.role}`} className="timeline-item">
                      <div className="timeline-dot" />
                      <WireframeBox className="p-6 col-span-12 md:col-span-11">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                          <div>
                            <p className="font-mono text-sm opacity-70 underline decoration-dashed underline-offset-4">{item.company}</p>
                            <h3 className="text-xl font-bold font-mono">{item.role}</h3>
                          </div>
                          <p className="font-mono text-sm border border-[color:var(--ink)] px-2 py-1 rounded inline-block bg-[var(--bg)] transform rotate-[-1deg]">{item.dates}</p>
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

              {/* PROJECTS */}
              <section id="projects" className="section">
                <div className="project-section-heading col-span-full">
                  <div>
                    <p className="mono-kicker">02. spec // projects</p>
                    <h2 className="section-title mb-3">Selected Works</h2>
                    <p className="font-sans text-[var(--muted)]">
                      Wider cards, tighter copy, same project coverage.
                    </p>
                  </div>
                </div>

                <div className="project-grid-body col-span-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <WireframeBox key={project.title} className="project-card-compact flex flex-col h-full bg-[var(--bg)]">
                        <div className="project-card-top flex justify-between items-start gap-3 mb-3">
                          <p className="font-mono text-xs uppercase opacity-70 underline decoration-dashed underline-offset-4">{project.eyebrow}</p>
                          <div className="project-metric border border-[color:var(--ink)] rounded-sm px-2 py-1 text-[0.68rem] font-mono font-bold bg-[var(--ink)] text-[var(--bg)]">
                            {project.metric}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold font-mono mb-2 leading-tight">{project.title}</h3>
                        <p className="project-copy text-sm font-sans opacity-85">
                          {project.problem} <span className="font-semibold">{project.outcome}</span>
                        </p>
                        
                        <ul className="flex flex-wrap gap-1.5 mt-4 mb-4">
                          {project.tech.map((item) => (
                            <li key={item} className="px-2 py-0.5 text-[0.68rem] border border-[color:var(--ink)] rounded font-mono">
                              {item}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex items-center gap-4 mt-auto border-t border-dashed border-[color:var(--hairline)] pt-3">
                          {project.githubHref && (
                            <a href={project.githubHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs underline wiggle-on-hover font-bold">
                              [ GitHub ]
                            </a>
                          )}
                          {project.siteHref && (
                            <a href={project.siteHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs underline wiggle-on-hover font-bold">
                              [ Site ]
                            </a>
                          )}
                          <div className="w-10 h-3 opacity-50 ml-auto">
                            <ScribbleArrow width={34} height={12} direction="right" />
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

              {/* SKILLS */}
              <section id="skills" className="section">
                <div className="section-aside relative">
                  <p className="mono-kicker">03. spec // stack</p>
                  <h2 className="section-title">Skills</h2>
                  <MarginDoodle type="tensor" className="absolute bottom-[-60px] left-0 opacity-40 scale-125 hidden md:block" />
                </div>

                <div className="section-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {skillGroups.map((group) => (
                      <WireframeBox key={group.name} className="p-6 relative">
                        <h3 className="font-mono text-lg font-bold mb-4 underline decoration-wavy underline-offset-8">
                          {group.name}
                        </h3>
                        <ul className="flex flex-col gap-3">
                          {group.items.map((item) => (
                            <li key={item} className="flex items-center gap-3">
                              <span className="w-4 h-4 border-[1.5px] border-[color:var(--ink)] rounded-[2px] inline-flex items-center justify-center">
                                <span className="w-2 h-2 bg-[var(--ink)] rounded-full scale-50 opacity-80"></span>
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
                  <h2 className="section-title mb-2">Let&apos;s Connect</h2>
                </div>
                
                <div className="col-span-full md:col-span-7">
                  <WireframeBox className="p-8 transform rotate-[1deg] w-full">
                    <h3 className="font-mono font-bold text-lg mb-6 underline decoration-dashed">form.contact</h3>
                    <form className="flex flex-col gap-6 font-mono w-full" onSubmit={handleContactSubmit}>
                      <input aria-label="Name" name="name" type="text" placeholder="Name" required className="p-3 border-2 border-[color:var(--ink)] rounded-[2px_4px_1px_3px] bg-transparent outline-none focus:bg-[var(--surface)] focus:shadow-[2px_2px_0_rgba(var(--shadow-rgb),0.1)] transition-all w-full" />
                      <input aria-label="Email" name="email" type="email" placeholder="Email" required className="p-3 border-2 border-[color:var(--ink)] rounded-[3px_2px_4px_1px] bg-transparent outline-none focus:bg-[var(--surface)] focus:shadow-[2px_2px_0_rgba(var(--shadow-rgb),0.1)] transition-all w-full" />
                      <input aria-hidden="true" tabIndex={-1} name="company" type="text" autoComplete="off" className="hidden" />
                      <textarea aria-label="Message" name="message" placeholder="Message..." rows={4} required className="p-3 border-2 border-[color:var(--ink)] rounded-[1px_3px_2px_4px] bg-transparent outline-none focus:bg-[var(--surface)] focus:shadow-[2px_2px_0_rgba(var(--shadow-rgb),0.1)] transition-all resize-none w-full"></textarea>
                      <div className="flex flex-wrap items-center gap-4">
                        <button type="submit" disabled={contactStatus === "sending"} className="button button--primary mt-4 self-start font-bold disabled:cursor-not-allowed disabled:opacity-60">
                          {contactStatus === "sending" ? "Sending..." : "Submit"}
                        </button>
                        {contactMessage ? (
                          <p className={`mt-4 text-sm ${contactStatus === "error" ? "text-red-700" : "text-[var(--ink)]"}`} role="status">
                            {contactMessage}
                          </p>
                        ) : null}
                      </div>
                    </form>
                  </WireframeBox>
                </div>
                
                <div className="col-span-full md:col-span-5 flex flex-col justify-center items-start md:pl-10 mt-8 md:mt-0">
                  <p className="font-mono opacity-60 text-sm mb-6">socials.json :</p>
                  <div className="flex flex-col gap-6">
                    <a href="https://www.linkedin.com/in/pranav-shewale/" target="_blank" rel="noreferrer" className="flex items-center gap-4 wiggle-on-hover">
                      <span className="w-10 h-10 rounded-full border-2 border-[color:var(--ink)] flex items-center justify-center font-mono font-bold opacity-80">in</span>
                      <span className="font-mono text-lg underline decoration-dashed underline-offset-4">LinkedIn</span>
                    </a>
                    <a href="https://github.com/prabhuuuuuuu" target="_blank" rel="noreferrer" className="flex items-center gap-4 wiggle-on-hover">
                      <span className="w-10 h-10 rounded-full border-2 border-[color:var(--ink)] flex items-center justify-center font-mono font-bold opacity-80 pr-[1px] pb-[2px]">{">"}</span>
                      <span className="font-mono text-lg underline decoration-dashed underline-offset-4">GitHub</span>
                    </a>
                    <a href="mailto:pranavprashantshewale@gmail.com" className="flex items-center gap-4 wiggle-on-hover">
                      <span className="w-10 h-10 rounded-full border-2 border-[color:var(--ink)] flex items-center justify-center font-mono font-bold opacity-80">@</span>
                      <span className="font-mono text-lg underline decoration-dashed underline-offset-4">pranavprashantshewale@gmail.com</span>
                    </a>
                  </div>
                </div>
              </section>

              <footer className="site-footer mt-12 w-full">
                <p>{'{ "copyright": "2026 Pranav Prashant Shewale" }'}</p>
                <p>{'{ "stack": "Next.js + RoughJS wireframe aesthetic" }'}</p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
