const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");

export const contactEmail = "pranavprashantshewale@gmail.com";

export type Social = {
  id: string;
  label: string;
  /** Short mono glyph shown before the label. */
  glyph: string;
  href: string;
  /** Compact handle shown in the hero row. */
  handle: string;
  external?: boolean;
};

export const socials: Social[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    glyph: "in",
    href: "https://www.linkedin.com/in/pranav-shewale/",
    handle: "pranav-shewale",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    glyph: ">",
    href: "https://github.com/prabhuuuuuuu",
    handle: "prabhuuuuuuu",
    external: true,
  },
  {
    id: "x",
    label: "X",
    glyph: "𝕏",
    href: "https://x.com/prnvprshnt",
    handle: "@prnvprshnt",
    external: true,
  },
  {
    id: "email",
    label: contactEmail,
    glyph: "@",
    href: `mailto:${contactEmail}`,
    handle: "email",
  },
];

export const siteName = "Pranav Shewale";
export const siteTitle = "Pranav Prashant Shewale | Physical AI Researcher & Student";
export const siteDescription =
  "Portfolio of Pranav Prashant Shewale, Co-Founder & CTO at Sentrix Robotics and BTech CS student at VIT Chennai. Work on tactile sensing, sim-to-real reinforcement learning, and perception systems for robots that act in the real world.";

/** Builds route-specific metadata that also overrides the OG/Twitter titles and canonical URL. */
export function pageMetadata(title: string, description: string, path: string) {
  const fullTitle = `${title} — ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path },
    twitter: { title: fullTitle, description },
  };
}

export type Section = {
  id: string;
  label: string;
  number: string;
  href: string;
};

export const sections: Section[] = [
  { id: "hero", label: "Intro", number: "00.", href: "/" },
  { id: "experience", label: "Experience", number: "01.", href: "/experience" },
  { id: "projects", label: "Projects", number: "02.", href: "/projects" },
  { id: "blog", label: "Blog", number: "03.", href: "/blog" },
  { id: "contact", label: "Contact", number: "04.", href: "/contact" },
];

export type Project = {
  title: string;
  eyebrow: string;
  problem: string;
  outcome: string;
  tech: string[];
  githubHref?: string;
  siteHref?: string;
  metric: string;
  featured?: boolean;
};

/**
 * Order matters: the grid renders [6,6] [8 featured, 4] [4,4,4], so slots
 * 1-3 carry the most weight. Lead with embodied / edge perception work,
 * then real-world sensing, then software-side systems.
 */
export const projects: Project[] = [
  {
    title: "Waste Sorting Vision Pipeline",
    eyebrow: "Edge perception // robotics",
    problem:
      "Automates material classification on constrained hardware so sorting decisions can happen at the edge, on the robot, without a cloud round-trip.",
    outcome:
      "Delivered 0.87 mAP at 30 FPS by quantizing and deploying a ViT + DETR pipeline through ONNX on Raspberry Pi.",
    tech: ["PyTorch", "ViT", "DETR", "ONNX", "Raspberry Pi"],
    metric: "0.87 mAP at 30 FPS",
  },
  {
    title: "Driver Fatigue Detection",
    eyebrow: "Real-time edge safety",
    problem:
      "Detects eye closure, yawning, and head-pose drift early enough for an in-cabin edge device to intervene in real time.",
    outcome:
      "Reached 95% accuracy with sub-50 ms latency and stable 30 FPS inference on Raspberry Pi hardware.",
    tech: ["TensorFlow", "OpenCV", "MobileNetV2", "Raspberry Pi"],
    githubHref: "https://github.com/prabhuuuuuuu/driver_fatigue",
    metric: "95% acc // <50 ms",
  },
  {
    title: "VLM-Prompted Drywall Segmentation",
    eyebrow: "Open-vocabulary perception",
    problem:
      "Localizes drywall defects in real-world inspection workflows without a fully supervised dataset for every defect class, the same data bottleneck robots hit in the field.",
    outcome:
      "Built a prompt-driven segmentation pipeline with SAM and Grounding DINO for zero-shot defect localization.",
    tech: ["SAM", "Grounding DINO", "VLMs", "Python", "Computer Vision"],
    githubHref: "https://github.com/prabhuuuuuuu/vlm-prompted-segmentation-drywall",
    metric: "zero-shot defects",
    featured: true,
  },
  {
    title: "FleetPulse",
    eyebrow: "Fleet telemetry // anomaly detection",
    problem:
      "Lets operators ask free-form questions about fleet-efficiency data and get narrated, number-backed answers instead of hand-writing SQL.",
    outcome:
      "Built a guarded text-to-SQL agent over DuckDB with an IsolationForest anomaly detector (0.98 ROC-AUC) in one Streamlit app.",
    tech: ["LangChain", "Groq", "DuckDB", "scikit-learn", "Streamlit"],
    githubHref: "https://github.com/prabhuuuuuuu/fleetpulse",
    metric: "0.98 ROC-AUC",
  },
  {
    title: "BeatNet",
    eyebrow: "Signal processing // sequence models",
    problem:
      "Classifies music genres by combining spatial Mel-spectrogram features with temporal sequence reasoning over raw audio signals.",
    outcome:
      "Built a CNN + BiLSTM pipeline over MFCC and spectrogram features with roughly 92% accuracy on GTZAN.",
    tech: ["PyTorch", "Librosa", "CNN", "BiLSTM", "MFCC"],
    githubHref: "https://github.com/prabhuuuuuuu/BeatNet",
    metric: "~92% accuracy",
  },
  {
    title: "AI Newsroom Agent",
    eyebrow: "Multi-agent orchestration",
    problem:
      "Coordinates research, drafting, critique, image generation, and publishing through one LangGraph task orchestration system.",
    outcome:
      "Adds autonomous routing, LLM refinement loops, checkpointed state, revision controls, and real-time Streamlit monitoring.",
    tech: ["LangGraph", "LangChain", "Streamlit", "Ollama", "Tavily"],
    githubHref: "https://github.com/prabhuuuuuuu/agentic_newsroom",
    metric: "5 agents",
  },
  {
    title: "ColdDraft",
    eyebrow: "Research discovery",
    problem:
      "Finds relevant researchers and turns noisy public web data into structured outreach targets for academic collaboration.",
    outcome:
      "Combined TF-IDF, cosine similarity, multi-threaded scraping, Llama 3 agent flows, and FastAPI outreach automation.",
    tech: ["NLP", "Llama 3", "FastAPI", "TF-IDF", "Scraping"],
    siteHref: "https://cold-draft.vercel.app/",
    metric: "agent outreach",
  },
];

export type Experience = {
  role: string;
  company: string;
  /** Human-readable range shown on the card. */
  dates: string;
  /** Machine-readable range for the timeline, "YYYY-MM". `end` omitted = present. */
  start: string;
  end?: string;
  /** Short category shown in the card eyebrow. */
  kind: string;
  /** Headline number for the card badge. */
  metric: string;
  /** Short telemetry key for the card footer readout. */
  telemetryKey: string;
  bullets: string[];
  tags: string[];
  paperHref?: string;
  paperLabel?: string;
  /** Company / project website shown in the panel footer. */
  siteHref?: string;
  siteLabel?: string;
  /** Rendered with the accent panel treatment. */
  featured?: boolean;
};

/** Reverse-chronological. `featured` gives the entry the accent panel treatment. */
export const experience: Experience[] = [
  {
    role: "Physical AI Research Fellow",
    company: "mjak.in",
    dates: "Nov 2026 - Present",
    start: "2026-11",
    kind: "Research // physical AI",
    metric: "Disclosure soon",
    telemetryKey: "MJAK_RND",
    bullets: [
      "Research and deliverables will be disclosed soon.",
      "Ongoing open-source contributions and research papers in physical AI.",
    ],
    tags: ["Open source", "Research papers", "Physical AI"],
    siteHref: "https://mjak.in",
    siteLabel: "mjak.in",
  },
  {
    role: "Co-Founder & CTO",
    company: "Sentrix Robotics Pvt. Ltd.",
    dates: "Mar 2026 - Present",
    start: "2026-03",
    kind: "Startup // physical AI",
    metric: "Tactile sensing",
    telemetryKey: "SENTRIX",
    bullets: [
      "Developing data pipelines and perception systems for physical AI using Python and PyTorch.",
      "Structuring sensory data processing to address robotic tactile-blindness problems.",
    ],
    tags: ["PyTorch", "Tactile sensing", "Sim-to-real", "Perception"],
    siteHref: "https://sentrixrobotics.com",
    siteLabel: "sentrixrobotics.com",
    featured: true,
  },
  {
    role: "AI Engineer / SDE Intern",
    company: "Bonzai",
    dates: "May 2026 - Jul 2026",
    start: "2026-05",
    end: "2026-07",
    kind: "Industry // ML infra",
    metric: "AWS inference APIs",
    telemetryKey: "BONZAI",
    bullets: [
      "Built an automated Python pipeline to extract and structure Shopify e-commerce data into an AWS database for model training.",
      "Designed AWS backend infrastructure for AI workloads with scalable inference APIs and CI/CD for reliable deployments.",
    ],
    tags: ["AWS", "Python", "CI/CD", "Data pipelines"],
  },
  {
    role: "Computer Vision Intern",
    company: "UrbanDienst",
    dates: "Nov 2025 - Feb 2026",
    start: "2025-11",
    end: "2026-02",
    kind: "Industry // edge vision",
    metric: "45 FPS @ 22 ms",
    telemetryKey: "MEMRYX",
    bullets: [
      "45 FPS at 22 ms latency on MemryX edge chips after quantizing YOLOv8 pipelines.",
      "Maintained a sub 50 MB memory footprint while keeping real-time inference practical.",
    ],
    tags: ["YOLOv8", "MemryX NPU", "Quantization", "Edge"],
  },
  {
    role: "AI + Robotics Intern",
    company: "IIT Mandi",
    dates: "Apr 2025 - Oct 2025",
    start: "2025-04",
    end: "2025-10",
    kind: "Research // robotics",
    metric: "85% multi-terrain",
    telemetryKey: "PPO_BIPED",
    bullets: [
      "85% multi-terrain success from a PPO locomotion policy built for biped robotics.",
      "18% F1 improvement on limited unlabeled data by applying self-supervised learning.",
      "Co-authored TongueSight, a YOLOv8 + Mask2Former + EfficientNet diagnostic pipeline reaching 92.0% accuracy, outperforming TongueNet and Cv-Swin Transformer.",
    ],
    tags: ["PPO", "Biped locomotion", "SSL", "YOLOv8", "Mask2Former"],
    paperHref: "https://dl.acm.org/doi/10.1145/3774521.3774545",
    paperLabel: "Paper → ICVGIP 2025",
  },
  {
    role: "AI Intern",
    company: "VIT Chennai",
    dates: "Sep 2024 - Dec 2024",
    start: "2024-09",
    end: "2024-12",
    kind: "Academic // perception",
    metric: "0.87 mAP @ 30 FPS",
    telemetryKey: "VIT_EDGE",
    bullets: [
      "30 FPS waste sorting inference at 0.87 mAP using a ViT + DETR pipeline on Raspberry Pi.",
      "25 FPS behavioral tracking from a YOLOv8 + StrongSORT perception system.",
    ],
    tags: ["ViT", "DETR", "StrongSORT", "Raspberry Pi"],
  },
];

export type Telemetry = {
  key: string;
  value: string;
  /** Rendered in accent with a pulsing dot. */
  live?: boolean;
};

/**
 * Ticker lines. Every number here is lifted verbatim from the experience /
 * project entries above — nothing is invented. Status labels are just labels.
 */
export const telemetry: Telemetry[] = [
  { key: "SIM_TO_REAL", value: "ACTIVE", live: true },
  { key: "EDGE_LATENCY", value: "22 ms" },
  { key: "YOLOV8_MEMRYX", value: "45 FPS" },
  { key: "MEM_FOOTPRINT", value: "< 50 MB" },
  { key: "PPO_MULTI_TERRAIN", value: "85%" },
  { key: "SSL_F1_DELTA", value: "+18%" },
  { key: "TONGUESIGHT_ACC", value: "92.0%" },
  { key: "WASTE_SORT", value: "0.87 mAP @ 30 FPS" },
  { key: "STRONGSORT_TRACK", value: "25 FPS" },
  { key: "FLEETPULSE_ROC_AUC", value: "0.98" },
  { key: "FATIGUE_DET", value: "95% / < 50 ms" },
  { key: "VENUE", value: "ICVGIP 2025" },
  { key: "ROLE", value: "CO-FOUNDER & CTO // SENTRIX", live: true },
  { key: "LOC", value: "VIT CHENNAI" },
];

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pranav Prashant Shewale",
  url: siteUrl,
  jobTitle: "Physical AI Researcher and Student",
  description:
    "Co-Founder & CTO at Sentrix Robotics and BTech CS student at VIT Chennai, working on tactile sensing, sim-to-real reinforcement learning, and perception systems for robots.",
  email: `mailto:${contactEmail}`,
  sameAs: socials.filter((s) => s.external).map((s) => s.href),
};
