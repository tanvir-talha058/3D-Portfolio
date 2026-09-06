export const projects = [
  {
    id: 'crimemap',
    title: 'CrimeMap BD',
    category: ['ai', 'web'],
    badge: 'Geospatial AI & Analytics',
    period: '2024 – 2026',
    summary:
      'A bilingual, responsive geospatial analytics platform with dynamic mapping, automated news classification, and NLP deduplication covering all 64 districts in Bangladesh.',
    metrics: '32x Speedup • 64 Districts Mapped • 91 Automated Tests • <100ms Latency',
    tech: ['Python', 'Flask', 'PostgreSQL', 'JavaScript', 'Leaflet.js', 'Vercel', 'Supabase'],
    architectureNodes: [
      '15+ News Scrapers',
      'Parallel Async Ingestion',
      'NLP Deduplication',
      'PostgreSQL / Supabase',
      'Leaflet.js Heatmaps'
    ],
    problem:
      'Fragmented crime reports across 15+ news portals with heavy duplicates made regional crime tracking slow and manual.',
    solution:
      'Engineered an asynchronous parallel ETL pipeline with NLP cosine-similarity deduplication and clustered geospatial heatmaps.',
    highlights: [
      'Engineered parallel asynchronous scrapers across 15+ national & regional news portals with 32x speedup.',
      'Implemented NLP-based deduplication and automated spatial classification to cluster identical incidents.',
      'Built interactive Leaflet.js clustering heatmaps and Chart.js analytical trend visualizations.',
      'Deployed serverless on Vercel + Supabase achieving sub-100ms API latency with 91 passing unit tests.'
    ],
    github: 'https://github.com/tanvir-talha058',
    featured: true
  },
  {
    id: 'levi',
    title: 'Enterprise Automation Tool for Levi Strauss & Co.',
    category: ['lang', 'web'],
    badge: 'Enterprise Automation',
    period: '2024 – 2025',
    summary:
      'Interactive desktop automation software to parse complex multi-sheet Excel data and autonomously auto-fill internal web forms with dynamic field mapping.',
    metrics: '100% Accuracy • 80%+ Reduction in Manual Processing Overhead',
    tech: ['Python', 'Selenium WebDriver', 'Pandas', 'Tkinter GUI', 'OpenPyXL'],
    architectureNodes: [
      'Excel Schema Parser',
      'Dynamic Column Mapper',
      'Selenium Dispatcher',
      'DOM Mutation Observer',
      'Audit Logger'
    ],
    problem:
      'Hundreds of manual form submissions daily with inconsistent vendor spreadsheets leading to clerical errors and delays.',
    solution:
      'Built a fault-tolerant Selenium engine with dynamic column mapping and real-time execution audit logging in a lightweight desktop UI.',
    highlights: [
      'Built resilient Selenium automation capable of handling complex dynamic DOM states, nested iframes, and AJAX validation.',
      'Developed an intuitive Tkinter dashboard for dynamic spreadsheet schema mapping and live validation logging.',
      'Significantly reduced human data-entry errors to zero while saving dozens of operator hours weekly.'
    ],
    github: 'https://github.com/tanvir-talha058',
    featured: true
  },
  {
    id: 'agrokart',
    title: 'AgroKart BD — Cross-Platform Marketplace',
    category: ['web'],
    badge: 'Full-Stack Ecosystem',
    period: '2024 – 2025',
    summary:
      'Cross-platform mobile and web agricultural commerce platform directly linking rural farmers with urban consumers to eliminate predatory intermediaries.',
    metrics: 'Flutter Mobile App + Responsive Web • Real-Time Order Management',
    tech: ['Flutter', 'Dart', 'Firebase', 'PHP', 'SQL', 'JavaScript', 'HTML/CSS'],
    architectureNodes: [
      'Flutter Mobile App',
      'Firebase Auth / Sync',
      'PHP REST Gateway',
      'MySQL Relational DB',
      'Farmer Portal Web'
    ],
    problem:
      'Farmers suffered from low profit margins due to middlemen and lacked direct digital market access.',
    solution:
      'Created an intuitive bilingual mobile application in Flutter backed by real-time inventory and order settlement.',
    highlights: [
      'Designed responsive, intuitive mobile UI in Flutter with multilingual localization for rural users.',
      'Implemented real-time authentication, category-based product search, order management, and secure cart flows.',
      'Built robust backend in PHP & SQL for administrative inventory auditing and transaction settlement.'
    ],
    github: 'https://github.com/tanvir-talha058',
    featured: false
  },
  {
    id: 'edubuddy',
    title: 'Edu-Buddy — AI Student Assistant',
    category: ['ai', 'lang'],
    badge: 'Voice AI & Assistant',
    period: '2023 – 2024',
    summary:
      'Voice-activated intelligent desktop companion engineered for automated study scheduling, personalized reminders, and swift educational resource retrieval.',
    metrics: 'Hands-Free Voice AI • Modular Dialog Flow Engine',
    tech: ['Python', 'SpeechRecognition', 'Google TTS', 'SQLite', 'Tkinter'],
    architectureNodes: [
      'Audio Ingestion',
      'Google Speech-to-Text',
      'Intent Parser',
      'SQLite Query Engine',
      'Google TTS Audio Output'
    ],
    problem:
      'Students struggle with managing split study schedules, deadlines, and multi-source exam materials hands-free.',
    solution:
      'Created a voice-first assistant with sub-second local SQLite lookups and dialog-driven scheduling.',
    highlights: [
      'Engineered modular natural language intent parsing and dialogue state flow for frictionless voice interaction.',
      'Integrated bi-directional speech recognition and text-to-speech audio pipelines for low-latency desktop execution.',
      'Built lightweight local SQLite database to store user schedules, course reminders, and priority tasks.'
    ],
    github: 'https://github.com/tanvir-talha058',
    featured: false
  },
  {
    id: 'gesturemouse',
    title: 'Hand Gesture Virtual Mouse',
    category: ['cv', 'ai'],
    badge: 'Computer Vision & HCI',
    period: '2023 – 2024',
    summary:
      'Real-time touchless virtual mouse enabling smooth cursor navigation, clicking, scrolling, and dragging using webcam hand landmark detection.',
    metrics: '60+ FPS Real-time Tracking • 0 Extra Hardware Cost (Standard Webcams)',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI'],
    architectureNodes: [
      'Webcam Video Stream',
      'MediaPipe 21-Landmark Extractor',
      'Angle & Distance Math',
      'Smoothing Filter',
      'PyAutoGUI OS Interop'
    ],
    problem:
      'Physical touch devices cause strain and hardware dependence, lacking a zero-cost touchless human-computer interface.',
    solution:
      'Designed a 60+ FPS trigonometric gesture detector running on standard commodity webcams with exponential moving average smoothing.',
    highlights: [
      'Utilized Google MediaPipe 21 3D-landmark hand tracking with custom trigonometric angle calculations for robust gesture discrimination.',
      'Optimized frame processing pipeline using OpenCV to achieve 60+ FPS responsive tracking on standard consumer webcams.',
      'Integrated PyAutoGUI for jitter-free cursor smoothing, drag-and-drop, and dynamic multi-finger gestures.'
    ],
    github: 'https://github.com/tanvir-talha058',
    featured: true
  },
  {
    id: 'taskmanager',
    title: 'Cross-Platform System Optimizer & Task Manager',
    category: ['lang'],
    badge: 'System Optimization',
    period: '2023 – 2024',
    summary:
      'Lightweight cross-platform utility to monitor active processes, inspect CPU/RAM consumption, and boost system responsiveness through automated memory purging.',
    metrics: '10-12% Performance Boost • Zero Idle Overhead',
    tech: ['Python', 'psutil', 'Tkinter GUI', 'OS Subprocesses'],
    architectureNodes: [
      'psutil Telemetry Ingestion',
      'Process Risk Classifier',
      'Memory Page Purge',
      'Tkinter Real-time Dashboard'
    ],
    problem:
      'Heavy background processes and stale memory caches degrade developer machine responsiveness over time.',
    solution:
      'Engineered an automated memory compaction utility that safely boosts device performance by 10-12% without instability.',
    highlights: [
      "Real-time CPU core, RAM usage, and active thread telemetry utilizing Python's psutil library.",
      'Implemented safe termination protocols and background cache-cleaning algorithms that boosted overall device responsiveness by 10-12%.',
      'Clean, responsive Tkinter graphical interface with dark-mode dashboard styling.'
    ],
    github: 'https://github.com/tanvir-talha058',
    featured: false
  }
];
