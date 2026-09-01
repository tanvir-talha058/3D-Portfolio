export const portfolioData = {
  personal: {
    name: "Tanvir Ahmed",
    title: "AI / ML Engineer & Researcher",
    currentRole: "AI/ML Engineer (Officer) @ upay (UCB Fintech)",
    email: "tanvirahmed123000@gmail.com",
    phone: "+8801906190296",
    whatsapp: "https://wa.me/8801906190296?text=Hi%20Tanvir,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!",
    calendly: "https://calendly.com/tanvirahmed123000/15min",
    github: "https://github.com/tanvir-talha058",
    githubUsername: "tanvir-talha058",
    linkedin: "https://linkedin.com/in/tanvir-talha058",
    linkedinUsername: "tanvir-talha058",
    location: "Dhaka, Bangladesh",
    resumeUrl: "/updated_resume_by_Tanvir.pdf",
    bio: "AI/ML Engineer and Researcher with proven expertise in architecting Multilingual RAG pipelines, Outbound Conversational AI platforms, Computer Vision workflows, and FinTech fraud detection engines. Passionate about turning cutting-edge ML research into high-impact, low-latency production applications.",
    status: "Available for High-Impact AI/ML Innovations",
    availability: "Immediate / Short Notice",
    experienceYears: "2+ Years (Applied Production & Research)"
  },

  recruiterCheatSheet: {
    targetRoles: ["AI/ML Engineer", "LLM / RAG Systems Architect", "Computer Vision Engineer", "MLOps / Backend AI Developer"],
    topHighlights: [
      "AI/ML Engineer at upay (UCB Fintech) architecting Outbound Conversational AI & UCSI University Cashless Campus.",
      "Built production Multilingual RAG chatbot (English/Bangla/Banglish) and real-time transaction Fraud Anomaly Engine at United Commercial Bank PLC.",
      "Published 20,000+ image dataset on Mendeley Data and authored research on Bangla regional dialect transformer classification across 20,090 samples.",
      "Achieved 32x speedup in parallel NLP ETL pipelines and <100ms serverless API latency on CrimeMap BD."
    ],
    techStackSummary: {
      coreLanguages: ["Python (Mastery)", "SQL / PostgreSQL", "C++", "JavaScript", "Dart", "PHP"],
      aiFrameworks: ["PyTorch", "TensorFlow", "Transformers", "LangChain", "OpenCV", "MediaPipe", "scikit-learn"],
      vectorDbsAndCloud: ["Qdrant", "ChromaDB", "Supabase", "Firebase", "Flask", "Vercel", "Docker"],
      specialties: ["Multilingual RAG", "Speech-to-Text", "Document OCR", "Fraud Anomaly Detection", "Computer Vision HCI"]
    },
    keyMetrics: [
      { label: "Pipeline Speedup", value: "32x" },
      { label: "CNN Accuracy", value: "97%+" },
      { label: "Published Dataset", value: "20K+ Images" },
      { label: "API Latency", value: "<100ms" }
    ]
  },
  
  metrics: [
    { value: "32x", label: "Speedup via Parallel ETL & Deduplication", sub: "CrimeMap BD Pipeline" },
    { value: "97%+", label: "CNN Validation Accuracy", sub: "Deep Learning Disease Classifier" },
    { value: "20,000+", label: "Annotated Dataset Images Published", sub: "Mendeley Data Repository" },
    { value: "<100ms", label: "Serverless Geospatial API Latency", sub: "Vercel + Supabase Stack" }
  ],

  experience: [
    {
      role: "AI/ML Engineer (Officer) - Strategy & Product",
      company: "upay (UCB Fintech Company Limited)",
      period: "June 2026 – Present",
      location: "Dhaka, Bangladesh",
      isCurrent: true,
      badge: "Fintech & Strategy",
      highlights: [
        "Architected an AI-powered outbound customer engagement platform integrating conversational AI, speech-to-text (STT), and LLM-based customer sentiment and insight extraction.",
        "Engineered automated lead qualification algorithms, dynamic follow-up pipelines, and real-time campaign performance analytics to maximize user conversion.",
        "Designed an end-to-end cashless campus digital ecosystem for UCSI University, enabling unified digital payments across cafeterias, transportation, campus events, and student services.",
        "Developed data-driven strategies for student onboarding, merchant acquisition, and QR payment adoption through upay mobile financial services."
      ],
      tech: ["LLMs", "Conversational AI", "Speech-to-Text", "Campaign Analytics", "FinTech Architecture", "QR Systems"]
    },
    {
      role: "AI/ML Intern - Digital Technology & Innovation (DTI)",
      company: "United Commercial Bank PLC.",
      period: "February 2026 – May 2026",
      location: "Dhaka, Bangladesh",
      isCurrent: false,
      badge: "Banking Innovation",
      highlights: [
        "Built a production-grade multilingual RAG chatbot supporting English, Bangla, and Banglish for banking customer support utilizing hybrid retrieval (dense embeddings + BM25 + neural reranking).",
        "Engineered a fully local indexing pipeline (web scraping → text normalization → chunking → embedding → Qdrant vector indexing) with strict context control and query filtering to suppress hallucination.",
        "Developed a hybrid document understanding pipeline combining OCR, layout-aware region segmentation, template matching, and human-in-the-loop validation for accurate handwritten text extraction.",
        "Developed a real-time transaction monitoring fraud detection system with risk scoring based on velocity, frequency, and behavioral signals for proactive anomaly detection."
      ],
      tech: ["Multilingual RAG", "LangChain", "Qdrant", "ChromaDB", "OCR / Document AI", "Fraud Scoring", "BM25"]
    },
    {
      role: "Student / Researcher & Applied ML Developer",
      company: "Independent Projects & Research",
      period: "2024 – 2025",
      location: "Dhaka, Bangladesh",
      isCurrent: false,
      badge: "Applied Research",
      highlights: [
        "Built and deployed diverse applied machine learning, computer vision, and automation solutions during B.Sc. studies.",
        "Collaborated closely with academic supervisors on large-scale dataset curation, transformer model design, and end-to-end application delivery.",
        "Applied modern software engineering and MLOps principles to deliver high-performance tools for real-world business and scientific challenges."
      ],
      tech: ["PyTorch", "TensorFlow", "Transformers", "Computer Vision", "OpenCV", "MediaPipe", "Flask"]
    }
  ],

  skills: {
    categories: [
      { id: "all", name: "All Technologies" },
      { id: "ai", name: "Generative AI & LLMs" },
      { id: "cv", name: "Computer Vision & Media" },
      { id: "web", name: "Full-Stack & Cloud" },
      { id: "lang", name: "Languages & Core Tools" }
    ],
    items: [
      // AI & LLM
      { name: "Large Language Models (LLMs & VLMs)", category: "ai", level: "Expert", desc: "Fine-tuning, prompt engineering, context control, structured output extraction" },
      { name: "Multilingual RAG Architectures", category: "ai", level: "Expert", desc: "Dense retrieval + BM25 + Neural rerankers in Bangla, Banglish & English" },
      { name: "LangChain & Vector Databases", category: "ai", level: "Expert", desc: "Qdrant, ChromaDB, hybrid indexing, metadata filtering" },
      { name: "PyTorch & TensorFlow / Keras", category: "ai", level: "Advanced", desc: "Deep neural network architectures, Transformers, CNNs, model optimization" },
      { name: "scikit-learn, NumPy & Pandas", category: "ai", level: "Expert", desc: "Statistical modeling, feature engineering, high-volume ETL pipelines" },
      
      // Computer Vision
      { name: "OpenCV & MediaPipe", category: "cv", level: "Advanced", desc: "Real-time gesture tracking, 3D hand landmarks, 60fps vision pipelines" },
      { name: "Document AI & OCR Pipelines", category: "cv", level: "Advanced", desc: "Handwritten character recognition, layout-aware segmentation, template matching" },
      { name: "Deepfake & Image Artifact Detection", category: "cv", level: "Advanced", desc: "Pixel-level frequency inconsistency detection and digital tampering forensics" },
      { name: "Convolutional Neural Networks (CNNs)", category: "cv", level: "Expert", desc: "Multi-class image classification with >97% validation accuracy" },

      // Web, Mobile & Cloud
      { name: "Python (Flask / FastAPI)", category: "web", level: "Expert", desc: "High-throughput asynchronous REST APIs, parallel HTTP processing" },
      { name: "Flutter & Dart", category: "web", level: "Advanced", desc: "Cross-platform mobile application development with real-time sync" },
      { name: "PostgreSQL & Supabase", category: "web", level: "Advanced", desc: "Relational database design, vector extensions, serverless SQL" },
      { name: "HTML5, CSS3, Tailwind CSS & JavaScript", category: "web", level: "Advanced", desc: "Modern glassmorphic responsive interfaces, animations & DOM interactions" },
      { name: "Firebase & Cloud Services", category: "web", level: "Advanced", desc: "Auth, Firestore, Cloud Functions, real-time sync, Vercel deployments" },

      // Languages & Core Tools
      { name: "Python", category: "lang", level: "Mastery", desc: "Primary language for ML, ETL, system automation & API backends" },
      { name: "C / C++ & Java", category: "lang", level: "Proficient", desc: "Strong foundation in data structures, algorithms & low-level memory" },
      { name: "SQL & PostgreSQL", category: "lang", level: "Advanced", desc: "Complex queries, indexing strategies, analytical aggregations" },
      { name: "Git, GitHub & CI/CD", category: "lang", level: "Advanced", desc: "Version control, automated testing workflows, collaborative git flow" },
      { name: "Selenium & Automation", category: "lang", level: "Advanced", desc: "Headless web scraping, automated form dispatch, dynamic DOM parsing" },
      { name: "Zapier, Make & Workflows", category: "lang", level: "Proficient", desc: "Low-code / no-code integration, webhook dispatching, event pipelines" }
    ]
  },

  projects: [
    {
      id: "crimemap",
      title: "CrimeMap BD",
      category: ["ai", "web"],
      badge: "Geospatial AI & Analytics",
      period: "2024 – 2026",
      summary: "A bilingual, responsive geospatial analytics platform with dynamic mapping, automated news classification, and NLP deduplication covering all 64 districts in Bangladesh.",
      metrics: "32x Speedup • 64 Districts Mapped • 91 Automated Tests • <100ms Latency",
      tech: ["Python", "Flask", "PostgreSQL", "JavaScript", "Leaflet.js", "Vercel", "Supabase"],
      architectureNodes: ["15+ News Scrapers", "Parallel Async Ingestion", "NLP Deduplication", "PostgreSQL / Supabase", "Leaflet.js Heatmaps"],
      problem: "Fragmented crime reports across 15+ news portals with heavy duplicates made regional crime tracking slow and manual.",
      solution: "Engineered an asynchronous parallel ETL pipeline with NLP cosine-similarity deduplication and clustered geospatial heatmaps.",
      highlights: [
        "Engineered parallel asynchronous scrapers across 15+ national & regional news portals with 32x speedup.",
        "Implemented NLP-based deduplication and automated spatial classification to cluster identical incidents.",
        "Built interactive Leaflet.js clustering heatmaps and Chart.js analytical trend visualizations.",
        "Deployed serverless on Vercel + Supabase achieving sub-100ms API latency with 91 passing unit tests."
      ],
      github: "https://github.com/tanvir-talha058",
      featured: true
    },
    {
      id: "levi",
      title: "Enterprise Automation Tool for Levi Strauss & Co.",
      category: ["lang", "web"],
      badge: "Enterprise Automation",
      period: "2024 – 2025",
      summary: "Interactive desktop automation software to parse complex multi-sheet Excel data and autonomously auto-fill internal web forms with dynamic field mapping.",
      metrics: "100% Accuracy • 80%+ Reduction in Manual Processing Overhead",
      tech: ["Python", "Selenium WebDriver", "Pandas", "Tkinter GUI", "OpenPyXL"],
      architectureNodes: ["Excel Schema Parser", "Dynamic Column Mapper", "Selenium Dispatcher", "DOM Mutation Observer", "Audit Logger"],
      problem: "Hundreds of manual form submissions daily with inconsistent vendor spreadsheets leading to clerical errors and delays.",
      solution: "Built a fault-tolerant Selenium engine with dynamic column mapping and real-time execution audit logging in a lightweight desktop UI.",
      highlights: [
        "Built resilient Selenium automation capable of handling complex dynamic DOM states, nested iframes, and AJAX validation.",
        "Developed an intuitive Tkinter dashboard for dynamic spreadsheet schema mapping and live validation logging.",
        "Significantly reduced human data-entry errors to zero while saving dozens of operator hours weekly."
      ],
      github: "https://github.com/tanvir-talha058",
      featured: true
    },
    {
      id: "agrokart",
      title: "AgroKart BD — Cross-Platform Marketplace",
      category: ["web"],
      badge: "Full-Stack Ecosystem",
      period: "2024 – 2025",
      summary: "Cross-platform mobile and web agricultural commerce platform directly linking rural farmers with urban consumers to eliminate predatory intermediaries.",
      metrics: "Flutter Mobile App + Responsive Web • Real-Time Order Management",
      tech: ["Flutter", "Dart", "Firebase", "PHP", "SQL", "JavaScript", "HTML/CSS"],
      architectureNodes: ["Flutter Mobile App", "Firebase Auth / Sync", "PHP REST Gateway", "MySQL Relational DB", "Farmer Portal Web"],
      problem: "Farmers suffered from low profit margins due to middlemen and lacked direct digital market access.",
      solution: "Created an intuitive bilingual mobile application in Flutter backed by real-time inventory and order settlement.",
      highlights: [
        "Designed responsive, intuitive mobile UI in Flutter with multilingual localization for rural users.",
        "Implemented real-time authentication, category-based product search, order management, and secure cart flows.",
        "Built robust backend in PHP & SQL for administrative inventory auditing and transaction settlement."
      ],
      github: "https://github.com/tanvir-talha058",
      featured: false
    },
    {
      id: "edubuddy",
      title: "Edu-Buddy — AI Student Assistant",
      category: ["ai", "lang"],
      badge: "Voice AI & Assistant",
      period: "2023 – 2024",
      summary: "Voice-activated intelligent desktop companion engineered for automated study scheduling, personalized reminders, and swift educational resource retrieval.",
      metrics: "Hands-Free Voice AI • Modular Dialog Flow Engine",
      tech: ["Python", "SpeechRecognition", "Google TTS", "SQLite", "Tkinter"],
      architectureNodes: ["Audio Ingestion", "Google Speech-to-Text", "Intent Parser", "SQLite Query Engine", "Google TTS Audio Output"],
      problem: "Students struggle with managing split study schedules, deadlines, and multi-source exam materials hands-free.",
      solution: "Created a voice-first assistant with sub-second local SQLite lookups and dialog-driven scheduling.",
      highlights: [
        "Engineered modular natural language intent parsing and dialogue state flow for frictionless voice interaction.",
        "Integrated bi-directional speech recognition and text-to-speech audio pipelines for low-latency desktop execution.",
        "Built lightweight local SQLite database to store user schedules, course reminders, and priority tasks."
      ],
      github: "https://github.com/tanvir-talha058",
      featured: false
    },
    {
      id: "gesturemouse",
      title: "Hand Gesture Virtual Mouse",
      category: ["cv", "ai"],
      badge: "Computer Vision & HCI",
      period: "2023 – 2024",
      summary: "Real-time touchless virtual mouse enabling smooth cursor navigation, clicking, scrolling, and dragging using webcam hand landmark detection.",
      metrics: "60+ FPS Real-time Tracking • 0 Extra Hardware Cost (Standard Webcams)",
      tech: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI"],
      architectureNodes: ["Webcam Video Stream", "MediaPipe 21-Landmark Extractor", "Angle & Distance Math", "Smoothing Filter", "PyAutoGUI OS Interop"],
      problem: "Physical touch devices cause strain and hardware dependence, lacking a zero-cost touchless human-computer interface.",
      solution: "Designed a 60+ FPS trigonometric gesture detector running on standard commodity webcams with exponential moving average smoothing.",
      highlights: [
        "Utilized Google MediaPipe 21 3D-landmark hand tracking with custom trigonometric angle calculations for robust gesture discrimination.",
        "Optimized frame processing pipeline using OpenCV to achieve 60+ FPS responsive tracking on standard consumer webcams.",
        "Integrated PyAutoGUI for jitter-free cursor smoothing, drag-and-drop, and dynamic multi-finger gestures."
      ],
      github: "https://github.com/tanvir-talha058",
      featured: true
    },
    {
      id: "taskmanager",
      title: "Cross-Platform System Optimizer & Task Manager",
      category: ["lang"],
      badge: "System Optimization",
      period: "2023 – 2024",
      summary: "Lightweight cross-platform utility to monitor active processes, inspect CPU/RAM consumption, and boost system responsiveness through automated memory purging.",
      metrics: "10-12% Performance Boost • Zero Idle Overhead",
      tech: ["Python", "psutil", "Tkinter GUI", "OS Subprocesses"],
      architectureNodes: ["psutil Telemetry Ingestion", "Process Risk Classifier", "Memory Page Purge", "Tkinter Real-time Dashboard"],
      problem: "Heavy background processes and stale memory caches degrade developer machine responsiveness over time.",
      solution: "Engineered an automated memory compaction utility that safely boosts device performance by 10-12% without instability.",
      highlights: [
        "Real-time CPU core, RAM usage, and active thread telemetry utilizing Python's psutil library.",
        "Implemented safe termination protocols and background cache-cleaning algorithms that boosted overall device responsiveness by 10-12%.",
        "Clean, responsive Tkinter graphical interface with dark-mode dashboard styling."
      ],
      github: "https://github.com/tanvir-talha058",
      featured: false
    }
  ],

  research: [
    {
      id: "bangla-dialects",
      title: "Towards Automatic Classification and Translation of Bangla Regional Dialects in Low-Resource Settings",
      domain: "Natural Language Processing, Deep Learning, Transformer Models",
      period: "2024 – Present",
      badge: "Ongoing Research",
      keyMetric: "20,090 Samples across 8 Dialects",
      summary: "Designed and developed a transformer-based NLP pipeline for Bangla regional dialect classification and translation into standardized Bengali, leveraging a curated 20,090-sample dataset across 8 distinct dialects.",
      details: "Addresses low-resource NLP challenges for localized dialects (Chittagong, Sylhet, Noakhali, Barisal, etc.) using customized tokenization, cross-attention representations, and transfer learning with BanglaBERT and m-BERT.",
      citation: `@article{ahmed2024bangla,
  title={Towards Automatic Classification and Translation of Bangla Regional Dialects in Low-Resource Settings},
  author={Ahmed, Tanvir},
  year={2024}
}`
    },
    {
      id: "deepfake",
      title: "Truth in Pixel: Deepfake Detection via Inconsistency Analysis",
      domain: "Computer Vision, Deep Learning, Digital Forensics",
      period: "2024 – Present",
      badge: "Computer Vision",
      keyMetric: "Pixel-Level Artifact & Boundary Analysis",
      summary: "Investigating pixel-level inconsistency detection and robust artifact-based deep learning pipelines to uncover subtle digital face-swaps and generative media manipulations.",
      details: "Focuses on high-frequency noise discrepancies, boundary blending artifacts, and physiological inconsistencies (eye blinking, lighting gradients) that evade traditional frame classifiers.",
      citation: `@article{ahmed2024truthinpixel,
  title={Truth in Pixel: Deepfake Detection via Inconsistency Analysis},
  author={Ahmed, Tanvir},
  year={2024}
}`
    },
    {
      id: "mbert",
      title: "Exploiting Transformer Architectures for Domain-Specific Text Categorization: The m-BERT Perspective",
      domain: "Transformer Learning, Deep Learning, NLP",
      period: "2024 – 2025",
      badge: "Benchmark Accuracy",
      keyMetric: "State-of-the-Art Benchmark Precision",
      summary: "Explores multilingual BERT fine-tuning techniques for highly specialized domain-specific categorization tasks, reaching benchmark accuracy exceeding prior baseline architectures.",
      details: "Demonstrates superior generalization when utilizing domain-adaptive pre-training combined with layer-wise discriminative learning rates.",
      citation: `@article{ahmed2025mbert,
  title={Exploiting Transformer Architectures for Domain-Specific Text Categorization: The m-BERT Perspective},
  author={Ahmed, Tanvir},
  year={2025}
}`
    },
    {
      id: "leaf-dataset",
      title: "Plant Leaf Disease Recognition Dataset",
      domain: "Mendeley Data Repository, Computer Vision",
      period: "2023 – 2024",
      badge: "Published Dataset",
      keyMetric: "20,000+ Annotated Leaf Images",
      summary: "Curated, processed, and published an open-access dataset of 20,000+ meticulously annotated plant leaf disease images (zucchini, hibiscus, gourd, papaya) to empower agricultural CV research.",
      details: "Dataset features high-resolution field captures with ground-truth agricultural pathology labels, enabling automated multi-class crop disease diagnostic benchmarking worldwide.",
      citation: `@data{ahmed2024leafdataset,
  title={Plant Leaf Disease Recognition Dataset},
  author={Ahmed, Tanvir},
  publisher={Mendeley Data},
  year={2024}
}`
    },
    {
      id: "leaf-cnn",
      title: "Deep Learning Models for Multi-Class Plant Leaf Disease Classification",
      domain: "Convolutional Neural Networks, Image Classification",
      period: "2023 – 2024",
      badge: ">97% Accuracy",
      keyMetric: "Validation Accuracy >97%",
      summary: "Trained and evaluated custom deep CNN architectures with advanced image augmentation and hyperparameter tuning, achieving over 97% validation accuracy across multiple plant species.",
      details: "Optimized model weights for mobile edge deployment to facilitate real-time, offline crop diagnosis for farmers in remote regions.",
      citation: `@article{ahmed2024leafcnn,
  title={Deep Learning Models for Multi-Class Plant Leaf Disease Classification},
  author={Ahmed, Tanvir},
  year={2024}
}`
    }
  ],

  education: [
    {
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "Daffodil International University",
      period: "2022 – 2025",
      badge: "Bachelor of Science",
      location: "Dhaka, Bangladesh",
      coursework: "Object-Oriented Programming, Data Structures and Algorithms, Databases (DBMS), Machine Learning & Data Mining, Image Processing, Operating Systems, Computer Networks, Computer Graphics, System Design, Software Engineering, Information Security, Statistics & Probability."
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Cantonment College Jashore",
      period: "2018 – 2020",
      badge: "GPA: 5.00 / 5.00",
      location: "Jashore, Bangladesh",
      coursework: "Science Curriculum (Mathematics, Physics, Chemistry, Biology, ICT)."
    },
    {
      degree: "Secondary School Certificate (SSC)",
      institution: "Nabojibon Institute Satkhira",
      period: "2016 – 2018",
      badge: "GPA: 5.00 / 5.00",
      location: "Satkhira, Bangladesh",
      coursework: "General Science Curriculum with Academic Excellence."
    }
  ],

  awards: [
    {
      title: "1st Position — District Level Science Fair",
      category: "Innovation Category",
      organization: "National Science & Technology Week",
      desc: "Awarded top honor for outstanding technical innovation, problem-solving ingenuity, and applied computational engineering."
    },
    {
      title: "3rd Position — Division Level Science Fair",
      category: "Innovation Category",
      organization: "Divisional Science & Innovation Council",
      desc: "Recognized among top regional scientific innovators for demonstration of advanced computational automation."
    }
  ]
};
