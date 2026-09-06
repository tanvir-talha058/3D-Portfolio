export const skills = {
  categories: [
    { id: 'all', name: 'All Technologies' },
    { id: 'ai', name: 'Generative AI & LLMs' },
    { id: 'cv', name: 'Computer Vision & Media' },
    { id: 'web', name: 'Full-Stack & Cloud' },
    { id: 'lang', name: 'Languages & Core Tools' }
  ],
  items: [
    // AI & LLM
    {
      name: 'Large Language Models (LLMs & VLMs)',
      category: 'ai',
      level: 'Expert',
      desc: 'Fine-tuning, prompt engineering, context control, structured output extraction'
    },
    {
      name: 'Multilingual RAG Architectures',
      category: 'ai',
      level: 'Expert',
      desc: 'Dense retrieval + BM25 + Neural rerankers in Bangla, Banglish & English'
    },
    {
      name: 'LangChain & Vector Databases',
      category: 'ai',
      level: 'Expert',
      desc: 'Qdrant, ChromaDB, hybrid indexing, metadata filtering'
    },
    {
      name: 'PyTorch & TensorFlow / Keras',
      category: 'ai',
      level: 'Advanced',
      desc: 'Deep neural network architectures, Transformers, CNNs, model optimization'
    },
    {
      name: 'scikit-learn, NumPy & Pandas',
      category: 'ai',
      level: 'Expert',
      desc: 'Statistical modeling, feature engineering, high-volume ETL pipelines'
    },

    // Computer Vision
    {
      name: 'OpenCV & MediaPipe',
      category: 'cv',
      level: 'Advanced',
      desc: 'Real-time gesture tracking, 3D hand landmarks, 60fps vision pipelines'
    },
    {
      name: 'Document AI & OCR Pipelines',
      category: 'cv',
      level: 'Advanced',
      desc: 'Handwritten character recognition, layout-aware segmentation, template matching'
    },
    {
      name: 'Deepfake & Image Artifact Detection',
      category: 'cv',
      level: 'Advanced',
      desc: 'Pixel-level frequency inconsistency detection and digital tampering forensics'
    },
    {
      name: 'Convolutional Neural Networks (CNNs)',
      category: 'cv',
      level: 'Expert',
      desc: 'Multi-class image classification with >97% validation accuracy'
    },

    // Web, Mobile & Cloud
    {
      name: 'Python (Flask / FastAPI)',
      category: 'web',
      level: 'Expert',
      desc: 'High-throughput asynchronous REST APIs, parallel HTTP processing'
    },
    {
      name: 'Flutter & Dart',
      category: 'web',
      level: 'Advanced',
      desc: 'Cross-platform mobile application development with real-time sync'
    },
    {
      name: 'PostgreSQL & Supabase',
      category: 'web',
      level: 'Advanced',
      desc: 'Relational database design, vector extensions, serverless SQL'
    },
    {
      name: 'HTML5, CSS3 & JavaScript',
      category: 'web',
      level: 'Advanced',
      desc: 'Modern glassmorphic responsive interfaces, animations & DOM interactions'
    },
    {
      name: 'Firebase & Cloud Services',
      category: 'web',
      level: 'Advanced',
      desc: 'Auth, Firestore, Cloud Functions, real-time sync, Vercel deployments'
    },

    // Languages & Core Tools
    {
      name: 'Python',
      category: 'lang',
      level: 'Mastery',
      desc: 'Primary language for ML, ETL, system automation & API backends'
    },
    {
      name: 'C / C++ & Java',
      category: 'lang',
      level: 'Proficient',
      desc: 'Strong foundation in data structures, algorithms & low-level memory'
    },
    {
      name: 'SQL & PostgreSQL',
      category: 'lang',
      level: 'Advanced',
      desc: 'Complex queries, indexing strategies, analytical aggregations'
    },
    {
      name: 'Git, GitHub & CI/CD',
      category: 'lang',
      level: 'Advanced',
      desc: 'Version control, automated testing workflows, collaborative git flow'
    },
    {
      name: 'Selenium & Automation',
      category: 'lang',
      level: 'Advanced',
      desc: 'Headless web scraping, automated form dispatch, dynamic DOM parsing'
    },
    {
      name: 'Zapier, Make & Workflows',
      category: 'lang',
      level: 'Proficient',
      desc: 'Low-code / no-code integration, webhook dispatching, event pipelines'
    }
  ]
};
