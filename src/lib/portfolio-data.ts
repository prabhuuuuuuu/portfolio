export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const contactEmail = "pranavprashantshewale@gmail.com";

export type Section = {
  id: string;
  label: string;
  number: string;
};

export const sections: Section[] = [
  { id: "hero", label: "Intro", number: "00." },
  { id: "experience", label: "Experience", number: "01." },
  { id: "projects", label: "Projects", number: "02." },
  { id: "skills", label: "Skills", number: "03." },
  { id: "contact", label: "Contact", number: "04." },
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
};

export const projects: Project[] = [
  {
    title: "AI Newsroom Agent",
    eyebrow: "Editorial system",
    problem:
      "Coordinates research, drafting, critique, image generation, and publishing through one LangGraph task orchestration system.",
    outcome:
      "Adds autonomous routing, LLM refinement loops, checkpointed state, revision controls, and real-time Streamlit monitoring.",
    tech: ["LangGraph", "LangChain", "Streamlit", "Ollama", "Tavily"],
    githubHref: "https://github.com/prabhuuuuuuu/agentic_newsroom",
    metric: "5 agents",
  },
  {
    title: "VLM-Prompted Drywall Segmentation",
    eyebrow: "Inspection vision",
    problem:
      "Localizes drywall defects in real-world inspection workflows without needing a fully supervised dataset for every defect class.",
    outcome:
      "Built a prompt-driven segmentation pipeline with SAM and Grounding DINO for zero-shot defect localization.",
    tech: ["SAM", "Grounding DINO", "Python", "Computer Vision"],
    githubHref: "https://github.com/prabhuuuuuuu/vlm-prompted-segmentation-drywall",
    metric: "zero-shot defects",
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
  {
    title: "BeatNet",
    eyebrow: "Audio intelligence",
    problem:
      "Classifies music genres by combining spatial Mel-spectrogram features with temporal sequence reasoning over audio signals.",
    outcome:
      "Built a CNN + BiLSTM pipeline over MFCC and spectrogram features with roughly 92% accuracy on GTZAN.",
    tech: ["PyTorch", "Librosa", "CNN", "BiLSTM", "MFCC"],
    githubHref: "https://github.com/prabhuuuuuuu/BeatNet",
    metric: "~92% accuracy",
  },
  {
    title: "FleetPulse",
    eyebrow: "Fleet analytics agent",
    problem:
      "Lets operators ask free-form questions about fleet-efficiency data and get narrated, number-backed answers instead of hand-writing SQL.",
    outcome:
      "Built a guarded text-to-SQL agent over DuckDB with an IsolationForest anomaly detector (0.98 ROC-AUC) in one Streamlit app.",
    tech: ["LangChain", "Groq", "DuckDB", "scikit-learn", "Streamlit"],
    githubHref: "https://github.com/prabhuuuuuuu/fleetpulse",
    metric: "0.98 ROC-AUC",
  },
];

export type Experience = {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
  paperHref?: string;
};

export const experience: Experience[] = [
  {
    role: "AI Engineer / SDE Intern",
    company: "Bonzai",
    dates: "May 2026 - July 2026",
    bullets: [
      "Built an automated Python data pipeline to extract and structure Shopify e-commerce data into an AWS database, providing clean datasets for AI model training.",
      "Designed AWS backend infrastructure for AI workloads with scalable inference APIs and automated CI/CD pipelines for reliable deployments.",
    ],
  },
  {
    role: "Co-Founder / Researcher",
    company: "Sentrix Robotics Pvt. Ltd.",
    dates: "Mar 2026 - Present",
    bullets: [
      "Developing data pipelines and perception systems for physical AI using Python and PyTorch.",
      "Structuring sensory data processing to address robotic tactile-blindness problems.",
    ],
  },
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
      "Co-authored TongueSight, an AI diagnostic pipeline using YOLOv8, Mask2Former, and EfficientNet-B0/ResNet feature extraction for tongue biomarkers; achieved 92.0% accuracy, outperforming TongueNet and Cv-Swin Transformer.",
    ],
    paperHref: "https://dl.acm.org/doi/10.1145/3774521.3774545",
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

export type SkillGroup = {
  name: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    name: "core",
    items: ["Python", "PyTorch", "TensorFlow", "Computer Vision", "Multi-Agent Systems", "RAG"],
  },
  {
    name: "tools",
    items: ["FastAPI", "React", "Docker", "Git", "Ollama", "ONNX", "AWS", "WebSockets"],
  },
  {
    name: "hardware",
    items: ["Raspberry Pi", "MemryX NPU", "Edge Deployments", "TensorFlow Lite"],
  },
  {
    name: "autonomy",
    items: ["Reinforcement Learning", "PPO", "Sensor Processing", "Physical AI"],
  },
];

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pranav Prashant Shewale",
  url: siteUrl,
  jobTitle: "AI Engineer and Computer Vision Researcher",
  description: "AI engineer focused on LLM agents, computer vision, physical AI, and edge-ready products.",
  email: `mailto:${contactEmail}`,
};
