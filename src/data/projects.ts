import type { ProjectEntry } from "@/types/content";

export const projects: ProjectEntry[] = [
  {
    id: "crimemap-bd",
    name: "CrimeMap BD",
    period: "2024 — 2026",
    stack: ["Python", "Flask", "PostgreSQL", "JavaScript", "Leaflet.js", "Vercel", "Supabase"],
    highlights: [
      "Bilingual, responsive geospatial dashboard covering 15+ Bangladeshi news sources across 64 districts",
      "Parallel HTTP fetching delivering a 32x speed improvement, with NLP-based deduplication",
      "Leaflet.js clustering, heatmaps, and Chart.js analytics; serverless on Vercel + Supabase",
      "Sub-100ms API response times, 91 passing tests",
    ],
  },
  {
    id: "levi-automation",
    name: "Automation Tool for Levi Strauss & Co.",
    period: "2024 — 2025",
    stack: ["Python", "Selenium", "Tkinter"],
    highlights: [
      "Interactive app to upload Excel and auto-fill web forms with dynamic field mapping",
      "Reduced manual data entry and errors in business workflows",
    ],
  },
  {
    id: "agrokart-bd",
    name: "AgroKart BD",
    period: "2024 — 2025",
    stack: ["Flutter", "Dart", "Firebase", "HTML/CSS/JS", "PHP", "SQL"],
    highlights: [
      "Cross-platform marketplace (Flutter app + web portal) connecting farmers directly with consumers",
      "User authentication, product listings, cart, and backend order management",
    ],
  },
  {
    id: "edu-buddy",
    name: "Edu-Buddy — AI Student Assistant",
    period: "2023 — 2024",
    stack: ["Python", "SpeechRecognition", "Google TTS", "SQLite", "Tkinter"],
    highlights: [
      "Voice-activated assistant for reminders, study schedules, and educational resources",
      "Modular intent parsing and dialog flow with integrated TTS and speech recognition",
    ],
  },
  {
    id: "hand-gesture-mouse",
    name: "Hand Gesture Virtual Mouse",
    period: "2023 — 2024",
    stack: ["Python", "OpenCV", "Mediapipe", "PyAutoGUI"],
    highlights: [
      "Real-time gesture-controlled cursor with click, scroll, and drag via multi-landmark detection",
      "Optimized frame pipeline for low-latency interaction on consumer hardware",
    ],
  },
  {
    id: "task-manager",
    name: "Cross-Platform Task Manager",
    period: "2023 — 2024",
    stack: ["Python", "psutil", "Tkinter"],
    highlights: [
      "Lightweight tool to monitor processes, CPU/memory usage, and perform safe terminations",
      "Boosted and optimized device performance by 10–12%",
    ],
  },
];
