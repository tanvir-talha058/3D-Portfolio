import type { ExperienceEntry } from "@/types/content";

export const experience: ExperienceEntry[] = [
  {
    id: "upay",
    role: "AI/ML Engineer (Officer) — Strategy & Product",
    org: "upay (UCB Fintech Company Limited)",
    period: "June 2026 — Present",
    bullets: [
      "Designed an AI-powered outbound engagement platform featuring conversational AI, speech-to-text, LLM-based customer insight extraction, automated lead qualification, follow-ups, and campaign analytics.",
      "Designed an end-to-end cashless campus ecosystem for UCSI University, enabling digital payments across cafeterias, transportation, campus events, and student services, with strategies for student onboarding, merchant acquisition, and QR payment adoption.",
    ],
    pipeline: [
      "Conversational AI",
      "Speech-to-Text",
      "LLM Insight Engine",
      "Lead Qualification",
      "Automated Follow-up",
      "Campaign Analytics",
    ],
  },
  {
    id: "ucb",
    role: "AI/ML Intern — Digital Technology & Innovation (DTI)",
    org: "United Commercial Bank PLC.",
    period: "February 2026 — May 2026",
    bullets: [
      "Built a production-grade multilingual RAG chatbot (English/Bangla/Banglish) using hybrid retrieval (dense embeddings + BM25 + reranking) on a fully local pipeline, with context control and query filtering to reduce hallucination.",
      "Developed a hybrid document understanding pipeline combining OCR, layout-aware region segmentation, template matching, and human-in-the-loop validation for handwritten banking documents.",
      "Developed a real-time fraud detection system with risk scoring based on velocity, frequency, and behavioral signals.",
    ],
    pipeline: ["User Query", "Hybrid Retrieval", "Reranking", "Local LLM", "Response"],
  },
];
