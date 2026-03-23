export type Metric = {
  label: string;
  value: string;
  tone?: "cyan" | "orange" | "green";
};

export type Project = {
  id: string;
  title: string;
  href?: string;
  category: string;
  summary: string;
  metrics: Metric[];
  stack: string[];
  flags: string[];
};

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: "cyan" | "orange" | "green";
};

export const introSequence = ["Initializing Agent...", "Loading Profile...", "Ready."];

export const quickStats: Metric[] = [
  { label: "Role", value: "AI Engineer + CV Researcher", tone: "cyan" },
  { label: "Core", value: "LangGraph / Vision / Edge AI", tone: "orange" },
  { label: "Deploy", value: "Raspberry Pi / MemryX / Docker", tone: "green" },
  { label: "Mode", value: "Multi-agent + real-time inference", tone: "cyan" },
];

export const featuredNewsroom: Project = {
  id: "newsroom",
  title: "Local-Agentic Newsroom",
  href: "https://github.com/prabhuuuuuuu/agentic_newsroom",
  category: "SYSTEM STATUS / PRIORITY SERVICE",
  summary:
    "A LangGraph + LangChain newsroom runtime coordinating research, writing, critique, image generation, and publishing with checkpointed state, conditional routing, and human-in-the-loop approvals.",
  metrics: [
    { label: "Agents active", value: "5 nodes", tone: "cyan" },
    { label: "Revision cap", value: "Max 3 loops", tone: "orange" },
    { label: "Sessions", value: "UUID tracked", tone: "green" },
    { label: "Runtime", value: "Ollama + SD 3.5", tone: "cyan" },
  ],
  stack: ["LangGraph", "LangChain", "Streamlit", "Tavily Search", "Stability AI SD 3.5", "Ollama"],
  flags: [
    "--checkpoint-state",
    "--conditional-routing",
    "--human-approval-workflow",
    "--live-event-streaming",
  ],
};

export const systems: Project[] = [
  {
    id: "fatigue",
    title: "Advanced Driver Fatigue Detection",
    href: "https://github.com/prabhuuuuuuu/driver_fatigue",
    category: "EDGE SAFETY STACK",
    summary:
      "A lightweight multi-signal fatigue monitor using CNN + MobileNetV2 with dlib landmarks to estimate eye closure, yawning, and head-pose drift on edge hardware.",
    metrics: [
      { label: "Accuracy", value: "95%", tone: "green" },
      { label: "Latency", value: "<50 ms", tone: "cyan" },
      { label: "Inference", value: "30 FPS on Pi", tone: "orange" },
    ],
    stack: ["TensorFlow", "OpenCV", "MobileNetV2", "dlib", "Raspberry Pi"],
    flags: ["--eye-closure", "--yawn-detection", "--head-pose", "--edge-inference"],
  },
  {
    id: "waste-sorting",
    title: "Waste Sorting Vision Pipeline",
    category: "VISION OPS",
    summary:
      "An end-to-end ViT + DETR sorting pipeline deployed via ONNX on Raspberry Pi for real-time classification and operational waste-routing decisions.",
    metrics: [
      { label: "mAP", value: "0.87", tone: "green" },
      { label: "Throughput", value: "30 FPS", tone: "cyan" },
      { label: "Model", value: "ViT + DETR", tone: "orange" },
    ],
    stack: ["PyTorch", "ViT", "DETR", "ONNX", "Raspberry Pi"],
    flags: ["--onnx-export", "--vision-transformer", "--edge-sorter", "--live-inference"],
  },
  {
    id: "beatnet",
    title: "BeatNet",
    href: "https://github.com/prabhuuuuuuu/BeatNet",
    category: "AUDIO INTELLIGENCE",
    summary:
      "A hybrid genre-classification engine using CNN spatial analysis on Mel-spectrograms and BiLSTM temporal reasoning over MFCC features.",
    metrics: [
      { label: "Accuracy", value: "~92%", tone: "green" },
      { label: "Dataset", value: "GTZAN", tone: "cyan" },
      { label: "Pipeline", value: "CNN + BiLSTM", tone: "orange" },
    ],
    stack: ["PyTorch", "Librosa", "CNN", "BiLSTM", "MFCC"],
    flags: ["--mel-spectrogram", "--temporal-sequence", "--genre-indexing", "--audio-tagging"],
  },
  {
    id: "voyage",
    title: "VoyageAI",
    href: "https://github.com/prabhuuuuuuu/VoyageAI",
    category: "FULL-STACK PRODUCT",
    summary:
      "An AI-assisted trip planner that turns user constraints into personalized itineraries with mapped routes, API orchestration, and frontend-first interaction design.",
    metrics: [
      { label: "Surface", value: "Interactive web app", tone: "cyan" },
      { label: "Mode", value: "AI itinerary generation", tone: "green" },
      { label: "Stack", value: "React + Vite", tone: "orange" },
    ],
    stack: ["React", "Vite", "JavaScript", "Maps APIs", "Prompt flows"],
    flags: ["--itinerary-builder", "--api-orchestration", "--map-visualization", "--personalization"],
  },
];

export const experience = [
  {
    role: "Computer Vision Intern",
    company: "UrbanDienst",
    date: "Nov 2025 - Feb 2026",
    descriptions: [
      "Deployed YOLOv8 object detection models for multiple tasks including PPE compliance, traffic monitoring, and pose estimation on MemryX edge chips.",
      "Optimized quantization to achieve 45 FPS at 22 ms latency under 50 MB memory for real-time inferencing.",
    ],
    metrics: ["45 FPS", "22 ms latency", "<50 MB memory"],
  },
  {
    role: "AI + Robotics Intern",
    company: "IIT Mandi",
    date: "Apr 2025 - Oct 2025",
    descriptions: [
      "Investigated deep learning techniques for limited unlabeled datasets and applied self-supervised learning to improve model F1-score by 18%.",
      "Engineered a reinforcement learning pipeline for biped locomotion and trained a single PPO policy to 85% success across multi-terrain environments using TD-MPC2-inspired checkpoints.",
    ],
    metrics: ["18% F1 gain", "85% terrain success", "PPO policy"],
  },
  {
    role: "AI Intern",
    company: "VIT Chennai",
    date: "Sep 2024 - Present",
    descriptions: [
      "Under Prof. Natarajan, architected TongueSight: a hybrid deep learning pipeline using YOLOv8 for coarse detection with Mask2Former, SegNet, and EfficientNet-B0 for fine-grained segmentation.",
      "Extracted five clinically relevant tongue features and achieved 92.0% accuracy, outperforming prior state-of-the-art methods with a modular design suited for mobile and edge deployment.",
    ],
    metrics: ["92.0% accuracy", "5 clinical features", "Edge-ready design"],
  },
];

export const graphNodes: GraphNode[] = [
  { id: "langgraph", label: "LangGraph", x: 52, y: 34, tone: "cyan" },
  { id: "agents", label: "Multi-Agent", x: 78, y: 26, tone: "green" },
  { id: "python", label: "Python", x: 24, y: 28, tone: "cyan" },
  { id: "vision", label: "Computer Vision", x: 18, y: 66, tone: "orange" },
  { id: "streamlit", label: "Streamlit", x: 64, y: 78, tone: "green" },
  { id: "edge", label: "Edge Deploy", x: 18, y: 84, tone: "green" },
  { id: "ollama", label: "Ollama", x: 82, y: 56, tone: "cyan" },
  { id: "fastapi", label: "FastAPI", x: 40, y: 68, tone: "orange" },
];

export const graphLinks: Array<[string, string]> = [
  ["langgraph", "agents"],
  ["langgraph", "python"],
  ["langgraph", "streamlit"],
  ["langgraph", "ollama"],
  ["vision", "fastapi"],
  ["vision", "edge"],
  ["python", "fastapi"],
  ["fastapi", "streamlit"],
  ["ollama", "agents"],
  ["edge", "fastapi"],
];
