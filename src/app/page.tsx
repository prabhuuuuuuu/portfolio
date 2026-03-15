"use client";

import { motion, useScroll, useSpring, Variants } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ChevronRight, 
  ExternalLink,
  Code2,
  Terminal,
  FileText
} from "lucide-react";
import React, { ReactNode } from "react";
import Image from "next/image";
import { InteractiveBackground } from "@/components/background/InteractiveBackground";
import { GlitchText } from "@/components/background/GlitchText";
import { ParallaxImage } from "@/components/background/ScrollAnimations";
import { TextReveal } from "@/components/background/ScrollAnimations";

// --- Framer Motion Shared Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// --- Subcomponents ---

const Section = ({ id, title, children }: { id: string, title?: string, children: ReactNode }) => (
  <motion.section 
    id={id}
    className="py-24 max-w-5xl mx-auto px-6"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={sectionVariants}
  >
    {title && (
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-mono text-primary font-bold tracking-tight">
          <span className="text-accent">#</span> {title}
        </h2>
        <div className="h-[1px] bg-secondary/30 flex-grow" />
      </div>
    )}
    {children}
  </motion.section>
);

const TimelineItem = ({ 
  role, 
  company, 
  date, 
  description,
  metrics
}: { 
  role: string, 
  company: string, 
  date: string, 
  description: string[],
  metrics?: string[]
}) => (
  <motion.div variants={itemVariants} className="relative pl-8 border-l border-surface pb-12 last:pb-0">
    <div className="absolute w-3 h-3 bg-accent rounded-full -left-[1.5px] translate-y-2 translate-x-[-4px] ring-4 ring-background" />
    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
      <h3 className="text-xl font-semibold text-primary">{role} <span className="text-accent">@ {company}</span></h3>
      <span className="text-secondary font-mono text-sm mt-1 md:mt-0">{date}</span>
    </div>
    <ul className="mt-4 space-y-2">
      {description.map((item, i) => (
        <li key={i} className="flex gap-3 text-secondary group">
          <ChevronRight className="w-5 h-5 text-accent/50 group-hover:text-accent transition-colors shrink-0 mt-0.5" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
    {metrics && (
      <div className="mt-4 flex flex-wrap gap-2">
        {metrics.map((metric, i) => (
          <span key={i} className="px-3 py-1 bg-surface text-xs font-mono text-primary rounded-md border border-secondary/20">
            {metric}
          </span>
        ))}
      </div>
    )}
  </motion.div>
);

const ProjectCard = ({ 
  title, 
  tech, 
  description,
  href 
}: { 
  title: string, 
  tech: string[], 
  description: string[],
  href?: string
}) => {
  const content = (
    <>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-background rounded-lg text-accent">
          <Terminal className="w-6 h-6" />
        </div>
        {href && <ExternalLink className="w-5 h-5 text-secondary group-hover:text-accent transition-colors shrink-0" />}
      </div>
      <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">{title}</h3>
      <ul className="text-secondary text-sm space-y-2 flex-grow mb-6">
        {description.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-accent mt-1 opacity-50">▹</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tech.map((t, i) => (
          <span key={i} className="text-xs font-mono text-accent/80 bg-accent/10 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
    </>
  );
  const className = "bg-surface p-6 rounded-xl border border-secondary/10 hover:border-accent/30 transition-all group flex flex-col h-full block";
  return href ? (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" variants={itemVariants} className={className}>
      {content}
    </motion.a>
  ) : (
    <motion.div variants={itemVariants} className={className}>
      {content}
    </motion.div>
  );
};

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen selection:bg-accent/30 selection:text-primary relative">
      <InteractiveBackground />
      <div className="relative z-10">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent transform-origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-40 border-b border-surface">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-mono font-bold text-accent text-xl cursor-default">
            PS
          </div>
          <div className="hidden md:flex gap-8 text-sm font-mono text-secondary">
            {['Experience', 'Research', 'Projects', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="hover:text-accent transition-colors block py-2"
              >
                <span className="text-accent/50 mr-1">/</span>{item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* HERO SECTION */}
        <Section id="hero">
          <motion.div 
            className="min-h-[70vh] flex flex-col md:flex-row md:items-start justify-between gap-12"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col justify-center flex-1">
            <motion.p variants={itemVariants} className="text-accent font-mono mb-4">
              &gt; Hello, world. I am
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-tight">
              <GlitchText className="inline-block">pranav prashant shewale</GlitchText>
            </motion.h1>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-secondary mb-8 tracking-tight">
              <TextReveal>i build ai systems that run anywhere.</TextReveal>
            </motion.h2>
            <motion.p variants={itemVariants} className="max-w-2xl text-secondary leading-relaxed mb-10 text-lg">
              engineering agentic systems and foundational ai optimized for the edge. i turn heavy architectures into lightweight, autonomous deployments. intelligence without the cloud tether.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4">
              <a href="#projects" className="px-6 py-3 bg-accent text-background font-semibold rounded hover:bg-accent/90 transition-colors flex items-center gap-2">
                <Code2 className="w-5 h-5" /> View Work
              </a>
              <a href="#contact" className="px-6 py-3 border border-secondary/30 text-primary font-semibold rounded hover:bg-surface transition-colors flex items-center gap-2">
                <Terminal className="w-5 h-5" /> Contact
              </a>
            </motion.div>
            </div>
            <motion.div variants={itemVariants} className="flex-shrink-0 flex justify-center md:justify-end md:pt-0 pt-4">
              <ParallaxImage speed={0.06}>
                <div className="relative w-56 h-72 md:w-72 md:h-96">
                  <Image
                    src="/images/cutout.png"
                    alt="Pranav Prashant Shewale"
                    fill
                    className="object-contain object-top"
                    priority
                    sizes="(max-width: 768px) 224px, 288px"
                  />
                </div>
              </ParallaxImage>
            </motion.div>
          </motion.div>
        </Section>

        {/* EXPERIENCE SECTION */}
        <Section id="experience" title="Experience">
          <motion.div 
            className="max-w-3xl ml-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <TimelineItem 
              role="Computer Vision Intern"
              company="UrbanDienst"
              date="Nov 2025 – Feb 2026"
              description={[
                "Deployed YOLOv8 object detection models for PPE compliance, traffic monitoring, and pose estimation on MemryX edge chips.",
                "Optimized quantization processes to dramatically improve inference performance on edge devices."
              ]}
              metrics={["45 FPS @ 22ms latency", "< 50 MB memory footpad", "MemryX"]}
            />
            <TimelineItem 
              role="AI + Robotics Intern"
              company="IIT Mandi"
              date="Apr 2025 – Oct 2025"
              description={[
                "Investigated deep learning techniques for limited unlabeled datasets.",
                "Applied self-supervised learning pipelines, markedly improving model reliability.",
                "Engineered a reinforcement learning pipeline for biped locomotion in multi-terrain environments."
              ]}
              metrics={["PPO Policy", "18% F1-score improvement", "85% multi-terrain success"]}
            />
            <TimelineItem 
              role="Artificial Intelligence Intern"
              company="Vellore Institute of Technology"
              date="Sep 2024 – Present"
              description={[
                "Built an end-to-end ViT + DETR waste sorting pipeline in PyTorch and deployed ONNX models on Raspberry Pi.",
                "Developed an AI perception engine using YOLOv8 + StrongSORT for tracking behavioral metrics."
              ]}
              metrics={["0.87 mAP", "30 FPS inference (RPi)", "25 FPS Tracking"]}
            />
          </motion.div>
        </Section>

        {/* RESEARCH SECTION - Publications before Projects */}
        <Section id="research" title="Research & Publications">
          <div className="bg-surface rounded-xl p-8 border border-secondary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-accent w-6 h-6" />
                <h3 className="text-xl font-bold text-primary">TongueSight: AI-Powered Tongue Analysis</h3>
              </div>
              <p className="text-secondary font-mono text-sm mb-6">
                Published at ICVGIP 2025 (14th Int. Conference on Graphics, Vision and Image Processing)
              </p>
              <ul className="space-y-3 ms-2">
                {[
                  "Developed a hybrid deep learning pipeline using YOLOv8 for coarse detection and Mask2Former/SegNet/EfficientNet-B0 for fine-grained segmentation.",
                  "Extracted clinically relevant tongue features (coating, jaggedness, cracks, filiform papillae size, fungiform redness) for digital traditional medicine diagnostics.",
                  "Achieved 92.0% accuracy, outperforming prior state-of-the-art like TongueNet (89.12%) and Cv-Swin (87.37%)."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-secondary">
                    <span className="text-accent mt-1 tracking-tighter">--</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* PROJECTS SECTION */}
        <Section id="projects" title="Featured Systems">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <ProjectCard 
              title="BeatNet"
              href="https://github.com/prabhuuuuuuu/BeatNet"
              description={[
                "A hybrid deep learning system for music genre classification combining CNNs (spatial features from Mel-spectrograms) and BiLSTMs (temporal patterns from MFCCs).",
                "Built with PyTorch and Librosa on the GTZAN dataset, achieving ~92% accuracy.",
                "Designed for music recommendation, auto-tagging, and audio indexing."
              ]}
              tech={["PyTorch", "Librosa", "CNN", "BiLSTM", "GTZAN"]}
            />
            <ProjectCard 
              title="VoyageAI"
              href="https://github.com/prabhuuuuuuu/VoyageAI"
              description={[
                "An interactive travel planning web app that generates personalized itineraries using AI and visualizes them on a map.",
                "Built with React.js and Vite, integrating third-party APIs for dynamic trip planning.",
                "Demonstrates modern frontend architecture, state management, and AI-driven user personalization."
              ]}
              tech={["React", "Vite", "JavaScript", "APIs"]}
            />
            <ProjectCard 
              title="Advanced Driver Fatigue Detection"
              href="https://github.com/prabhuuuuuuu/driver_fatigue"
              description={[
                "Engineered a CNN + MobileNetV2 architecture with dlib facial landmark detection.",
                "Analyzes complex physiological indicators like eye closure, yawning, and head pose.",
                "Optimized TensorFlow + OpenCV pipeline targeting Raspberry Pi ecosystem."
              ]}
              tech={["TensorFlow", "MobileNetV2", "OpenCV", "dlib", "Raspberry Pi"]}
            />
            <ProjectCard 
              title="Local Agentic Newsroom"
              href="https://github.com/prabhuuuuuuu/agentic_newsroom"
              description={[
                "Built a multi-agent AI framework orchestrating 5 specialized nodes (Researcher, Writer, Critic, Imager, Publisher).",
                "Implemented checkpoint-based state management, conditional routing, and human-in-the-loop oversight.",
                "Developed scalable event streaming dashboard with UUID-based session tracking and safety loops."
              ]}
              tech={["LangGraph", "Streamlit", "Llama 3", "Tavily", "Ollama"]}
            />
          </motion.div>
        </Section>

        {/* CONTACT SECTION */}
        <Section id="contact" title="Establish Connection">
          <motion.div 
            className="text-center max-w-xl mx-auto py-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={itemVariants} className="text-secondary mb-8 text-lg">
              Currently open to new opportunities targeting ML engineering, edge deployment, and AI system architecture. 
              Whether you have a question or just want to say hi, my inbox is computationally open.
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-12">
              <a href="mailto:pranavprashantshewale@gmail.com" className="p-3 bg-surface border border-secondary/20 rounded-full text-secondary hover:text-accent hover:border-accent/50 hover:bg-background transition-all" aria-label="Email">
                <Mail className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/" className="p-3 bg-surface border border-secondary/20 rounded-full text-secondary hover:text-accent hover:border-accent/50 hover:bg-background transition-all" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://github.com/" className="p-3 bg-surface border border-secondary/20 rounded-full text-secondary hover:text-accent hover:border-accent/50 hover:bg-background transition-all" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </a>
            </motion.div>
            <motion.a 
              variants={itemVariants}
              href="mailto:pranavprashantshewale@gmail.com" 
              className="inline-block px-8 py-4 bg-transparent border-2 border-accent text-accent font-mono font-semibold rounded hover:bg-accent/10 transition-colors"
            >
              Init System Call (Say Hello)
            </motion.a>
          </motion.div>
        </Section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 text-center text-secondary/60 font-mono text-sm border-t border-surface mt-20">
        <p>Built by Pranav Prashant Shewale</p>
        <p className="mt-2 text-xs">V.1.0.0 // {new Date().getFullYear()}</p>
      </footer>
      </div>
    </div>
  );
}
