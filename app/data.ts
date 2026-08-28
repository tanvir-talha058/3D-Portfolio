export type CaseStudy = {
  problem: string;
  approach: string;
  architecture: string[];
  result: string;
  lesson: string;
};

export type Project = {
  title: string;
  category: string;
  stack: string[];
  description: string;
  /** Hard numbers, where the work actually produced them. */
  metrics?: { value: string; label: string }[];
  caseStudy: CaseStudy;
};

/* The canonical origin. Everything that needs an absolute URL — metadataBase,
   the sitemap, robots — reads it from here so there is one place to change
   when the domain is settled. */
export const site = {
  url: 'https://tanvir.dev',
  name: 'Tanvir Ahmed',
  role: 'AI/ML Engineer',
};

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

/* All education data below is taken verbatim from the CV in /public. */
export const education = {
  degree: 'B.Sc. in Computer Science & Engineering',
  school: 'Daffodil International University',
  years: '2022 - 2025',
  coursework: [
    'Data Structures and Algorithms',
    'Machine Learning and Data Mining',
    'Image Processing',
    'Computer Graphics',
    'Operating Systems',
    'Computer Networks',
    'Databases',
    'Discrete Mathematics',
    'Object-Oriented Programming',
    'System Design',
    'Software Engineering',
    'Information Security',
    'Statistics and Probability',
  ],
  prior: [
    { school: 'Cantonment College Jashore', award: 'Higher Secondary Certificate', years: '2018 - 2020', gpa: 'GPA 5.00' },
    { school: 'Nabojibon Institute Satkhira', award: 'Secondary School Certificate', years: '2016 - 2018', gpa: 'GPA 5.00' },
  ],
};

/* The four layers of the network diagram, and what each one stands for in
   the work. Labels are the diagram's legend, not decoration. */
export const netLayers = [
  { label: 'Signal', note: 'Text, image, transaction, sensor' },
  { label: 'Features', note: 'Embeddings, OCR regions, landmarks' },
  { label: 'Representation', note: 'Transformers, CNNs, hybrid retrieval' },
  { label: 'Decision', note: 'Ranked answer, risk score, class' },
];

export const expertise = [
  {
    area: 'Language & Retrieval',
    detail:
      'Hybrid dense + BM25 retrieval, reranking, context control, and multilingual pipelines for Bangla, English, and Banglish.',
    tools: ['LangChain', 'Qdrant', 'ChromaDB', 'BM25', 'XLM-R', 'm-BERT'],
  },
  {
    area: 'Computer Vision',
    detail:
      'CNN classification, OCR and layout-aware segmentation, landmark tracking, and manipulation detection on real imagery.',
    tools: ['PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'MediaPipe'],
  },
  {
    area: 'Applied Risk & Data',
    detail:
      'Behavioural risk scoring, anomaly detection architecture, geospatial clustering, and analytics that hold up in production.',
    tools: ['scikit-learn', 'Pandas', 'NumPy', 'PostgreSQL', 'Matplotlib'],
  },
];

/* Grouped exactly as the CV groups them — a flat cloud of logos hides the
   shape of what someone actually knows. */
export const stackGroups = [
  {
    group: 'Languages',
    items: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'Dart', 'PHP', 'SQL', 'PostgreSQL'],
  },
  {
    group: 'AI / ML',
    items: [
      'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'OpenCV', 'MediaPipe',
      'NumPy', 'Pandas', 'LangChain', 'ChromaDB', 'Qdrant', 'Matplotlib', 'Seaborn',
    ],
  },
  {
    group: 'Web, Mobile & Tools',
    items: [
      'React', 'Tailwind CSS', 'Bootstrap', 'Flutter', 'Firebase', 'Git',
      'Docker', 'Figma', 'OpenGL', 'Selenium', 'Google Colab', 'Kaggle',
    ],
  },
  {
    group: 'Concepts & Domains',
    items: [
      'Machine Learning', 'Deep Learning', 'Computer Vision', 'RAG', 'LLM', 'VLM',
      'OCR', 'NLP', 'Object Tracking', 'Information Retrieval', 'Automation',
      'Data Visualization', 'IoT', 'Human-Computer Interaction',
    ],
  },
];

export const awards = [
  { place: 'First Position', event: 'District Level Science Fair', category: 'Innovation' },
  { place: 'Third Position', event: 'Division Level Science Fair', category: 'Innovation' },
];

/**
 * Anchor nodes in the hero field. Each maps to a real domain in the work,
 * and to the section a visitor should land on when they click it.
 */
export const domains = [
  { id: 'language', label: 'Language', href: '#research', colour: '#5442b5', pos: [1.75, 0.55, -0.35] as [number, number, number] },
  { id: 'retrieval', label: 'Retrieval', href: '#work', colour: '#8d7bf2', pos: [-1.55, 0.95, 0.55] as [number, number, number] },
  { id: 'vision', label: 'Vision', href: '#work', colour: '#4fb8e8', pos: [0.35, -1.45, 1.15] as [number, number, number] },
  { id: 'risk', label: 'Risk', href: '#work', colour: '#9df3e2', pos: [-0.85, -0.75, -1.55] as [number, number, number] },
  { id: 'geospatial', label: 'Geospatial', href: '#work', colour: '#e08ad2', pos: [0.95, 1.35, 0.95] as [number, number, number] },
  { id: 'automation', label: 'Automation', href: '#experience', pos: [-1.15, -0.25, 1.45] as [number, number, number], colour: '#6fd6ee' },
];

/**
 * A project's accent is the colour of its own node in the hero field, so the
 * two are visibly the same map rather than two unrelated decorations. A
 * category with no node in the field falls back to the ramp's cold end.
 */
export function domainColour(category: string): string {
  const hit = domains.find((d) => d.label.toLowerCase() === category.toLowerCase());
  return hit?.colour ?? '#8a93b8';
}

export const capabilities = [
  { k: 'AI / ML', v: 'Intelligent Systems' },
  { k: 'Strategy', v: 'Product-Led Decision Making' },
  { k: 'Build', v: 'Production-Ready Engineering' },
  { k: 'Research', v: 'Applied AI & NLP' },
];

export const experience = [
  {
    title: 'AI/ML Engineer (Officer) - Strategy & Product',
    company: 'upay (UCB Fintech Company Limited)',
    period: '2026 (June) - Present',
    current: true,
    details: [
      'Designed an AI-powered outbound engagement platform with conversational AI, speech-to-text, LLM-based customer insight extraction, lead qualification, follow-ups, and campaign analytics.',
      'Built a cashless campus ecosystem for UCSI University covering payments, student onboarding, merchant acquisition, and QR adoption strategy.',
    ],
  },
  {
    title: 'AI/ML Intern - Digital Technology & Innovation (DTI)',
    company: 'United Commercial Bank PLC.',
    period: '2026 (February) - 2026 (May)',
    current: false,
    details: [
      'Built a multilingual Bengali-English-Banglish RAG chatbot with hybrid retrieval, dense embeddings, BM25 reranking, and local vector indexing to reduce hallucination.',
      'Developed a document understanding pipeline combining OCR, layout-aware region segmentation, template matching, and human-in-the-loop refinement for banking workflows.',
      'Created a fraud detection prototype with behavioral risk scoring and scalable anomaly-detection architecture.',
    ],
  },
  {
    title: 'Student / Researcher',
    company: 'Independent Projects & Research',
    period: '2024 - 2025',
    current: false,
    details: [
      'Implemented applied ML and automation projects during B.Sc., covering research, dataset curation, model design, and production-minded applications.',
      'Delivered academic and client projects across NLP, automation, and intelligent systems.',
    ],
  },
];

export const pipeline = [
  'Data Intake',
  'Processing',
  'Embedding',
  'Retrieval',
  'LLM Intelligence',
  'Decision Layer',
  'User Impact',
];

export const projects: Project[] = [
  {
    title: 'CrimeMap BD',
    category: 'Geospatial',
    stack: ['Python', 'Flask', 'PostgreSQL', 'Leaflet.js', 'Vercel', 'Supabase'],
    description:
      'Bilingual geospatial intelligence dashboard for Bangladesh news classification, event clustering, and district-level risk mapping.',
    metrics: [
      { value: '32x', label: 'faster ingestion' },
      { value: '<100ms', label: 'API response' },
      { value: '91', label: 'passing tests' },
    ],
    caseStudy: {
      problem:
        'The challenge was turning fragmented news and location signals into a dependable, real-time intelligence map for public and operational analysis.',
      approach:
        'I combined NLP-based classification, parallel data collection, deduplication logic, geospatial clustering, and dashboard analytics to convert raw events into actionable intelligence.',
      architecture: ['News ingestion', 'NLP classification', 'Geo-tagging & deduplication', 'Map clustering', 'Analytics layer'],
      result:
        'Parallel HTTP fetching cut ingestion time by 32x across 15+ news sources and all 64 districts, with sub-100ms API responses and 91 passing tests covering API routes, classification, and event clustering.',
      lesson:
        'Strong product thinking matters: data quality and visualization are as important as model accuracy when building decision-support tools.',
    },
  },
  {
    title: 'RAG Chatbot',
    category: 'Retrieval',
    stack: ['LangChain', 'Qdrant', 'BM25', 'Local LLMs', 'OCR'],
    description:
      'Multilingual customer support assistant for banking with hybrid retrieval and local document intelligence.',
    caseStudy: {
      problem:
        'Customer support needed a safer, more accurate multilingual assistant that could operate on local documentation without hallucinating or confusing policy context.',
      approach:
        'I built a hybrid retrieval stack using dense embeddings, BM25, reranking, context control, and document preprocessing to ground responses in trusted content.',
      architecture: ['Document ingestion', 'Chunking & preprocessing', 'Hybrid indexing', 'Retrieval + rerank', 'Response grounding'],
      result:
        'The system improved answer quality, reduced hallucination risk, and created a more reliable support workflow for multilingual queries.',
      lesson:
        'In production systems, retrieval design and response constraints are often more important than raw model capability.',
    },
  },
  {
    title: 'Fraud Detection System',
    category: 'Risk',
    stack: ['Python', 'Risk Scoring', 'Analytics', 'Behavioral Signals'],
    description: 'Real-time transaction monitoring and anomaly detection design for financial risk assessment.',
    caseStudy: {
      problem:
        'The key challenge was identifying suspicious financial behavior quickly, using velocity, frequency, and behavioral signals without overloading analysts.',
      approach:
        'I designed a risk-scoring architecture centered on anomalous transaction patterns and future-ready ML expansion for anomaly detection and profiling.',
      architecture: ['Behavior signal extraction', 'Risk scoring', 'Thresholding', 'Behavior profiling', 'Alerting logic'],
      result: 'This created a strong foundation for scalable real-time monitoring and more proactive fraud intelligence.',
      lesson: 'Good ML products are designed around operating constraints, not only model performance.',
    },
  },
  {
    title: 'Bangla Dialect Classification',
    category: 'Language',
    stack: ['XLM-R', 'TF-IDF', 'Transformers', '8 dialect classes'],
    description: 'Research-driven dialect classification pipeline using low-resource Bangla data, achieving 86% accuracy.',
    metrics: [
      { value: '86%', label: 'accuracy' },
      { value: '20,090', label: 'samples' },
      { value: '8', label: 'dialect classes' },
    ],
    caseStudy: {
      problem:
        'Low-resource Bangla dialect classification required careful data cleaning and model choice because linguistic variation makes standard methods brittle.',
      approach:
        'I designed a transformer-based and TF-IDF ensemble pipeline for dialect identification using curated data and robust preprocessing.',
      architecture: ['Dataset curation', 'Preprocessing', 'Feature engineering', 'Transformer classification', 'Ensemble scoring'],
      result: 'The work reached strong classification performance and demonstrated the value of data quality in low-resource NLP.',
      lesson: 'In NLP, thoughtful preprocessing and data curation can matter as much as the model architecture itself.',
    },
  },
  {
    title: 'AgroKart BD',
    category: 'Product',
    stack: ['Flutter', 'Dart', 'Firebase', 'PHP', 'SQL'],
    description:
      'Cross-platform marketplace connecting farmers and consumers with order management and digital commerce flows.',
    caseStudy: {
      problem: 'Farmers and customers were disconnected by fragmented digital pathways, making commerce and product discovery inefficient.',
      approach:
        'I built a cross-platform marketplace with product flows, authentication, cart handling, and transactional infrastructure connecting supply and demand.',
      architecture: ['User flows', 'Product catalog', 'Order management', 'Mobile + web interface', 'Backend services'],
      result: 'The platform created a connected commerce experience with a strong foundation for digital marketplace growth.',
      lesson: 'Technical implementation must always match the end-user journey and business flow.',
    },
  },
  {
    title: 'Hand Gesture Virtual Mouse',
    category: 'Vision',
    stack: ['OpenCV', 'MediaPipe', 'PyAutoGUI'],
    description: 'Low-latency gesture control interface for cursor movement, scrolling, click, and drag operations.',
    caseStudy: {
      problem: 'The goal was to create a natural, low-latency computer interaction model without the friction of a physical mouse or touchpad.',
      approach:
        'I used real-time hand landmark detection and optimized the frame pipeline for smooth control, clicks, scrolling, and drag gestures.',
      architecture: ['Video frame capture', 'Landmark detection', 'Gesture recognition', 'Action mapping', 'Low-latency interaction layer'],
      result: 'The system delivered responsive human-computer interaction on consumer hardware with low latency.',
      lesson: 'For interaction systems, performance and usability are not optional; they are the product.',
    },
  },
];

export const research = [
  {
    title: 'Bangla Regional Dialects',
    subtitle: 'Low-resource NLP / Deep Learning',
    detail: '20,090 samples across 8 dialects with transformer-based classification and ensemble reasoning.',
    result: '86% accuracy',
    done: true,
  },
  {
    title: 'Transformers for Domain-Specific Text Categorization',
    subtitle: 'The m-BERT Perspective',
    detail:
      'Transformer-based categorization for domain-specific text, benchmarked against existing work in the area.',
    result: 'Benchmark-leading accuracy',
    done: true,
  },
  {
    title: 'Truth in Pixel',
    subtitle: 'Deepfake Detection',
    detail: 'Pixel-level inconsistency detection and artifact-based manipulation analysis.',
    result: 'Research in progress',
    done: false,
  },
  {
    title: 'Plant Leaf Disease Recognition',
    subtitle: 'Computer Vision Dataset',
    detail:
      '20,000+ annotated leaf images (zucchini, hibiscus, gourd, papaya) published on Mendeley Data, with CNN classifiers trained on top.',
    result: '97%+ validation accuracy',
    done: true,
  },
];

export const stack = [
  'Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'LangChain', 'Qdrant', 'PostgreSQL',
  'Docker', 'Git', 'Flutter', 'SQL', 'React', 'Node.js', 'Figma', 'Firebase',
];

export const principles = [
  { title: 'Understand', text: 'Start with the real problem, the real user, and the real operational context.' },
  { title: 'Simplify', text: 'Remove unnecessary complexity and build the smallest useful system that delivers value.' },
  { title: 'Build', text: 'Translate ideas into reliable, testable, production-ready systems.' },
  { title: 'Measure', text: 'Use data and feedback to refine decision quality and business outcomes.' },
];

export const contact = {
  email: 'tanvirahmed123000@gmail.com',
  phone: '+8801906190296',
  github: 'https://github.com/tanvir-talha058',
  linkedin: 'https://linkedin.com/in/tanvir-talha058',
  cv: '/tanvir-ahmed-cv.pdf',
};

/* ---------------------------------------------------------------------
   Attention map. The research section's diagram is a real self-attention
   heatmap, not a texture: a Banglish banking query — the exact register
   the UCB assistant has to handle — read by four heads that each do a
   different job. Scores below are turned into rows by a softmax at
   render time, so every row genuinely sums to 1 the way attention does.
   --------------------------------------------------------------------- */

export const attnTokens = [
  '[CLS]', 'ami', 'ki', 'tomar', 'account', 'balance', 'dekhte', 'pari', '?', '[SEP]',
];

export type AttnHead = {
  id: string;
  name: string;
  note: string;
  /** Raw score for query i attending to key j, pre-softmax. */
  score: (i: number, j: number) => number;
};

export const attnHeads: AttnHead[] = [
  {
    id: 'positional',
    name: 'Positional',
    note: 'Looks one token back. The head that keeps word order.',
    score: (i, j) => -Math.abs(j - (i - 1)) * 2.6 + (i === j ? 0.4 : 0),
  },
  {
    id: 'syntactic',
    name: 'Syntactic',
    note: 'Binds the possessive to its noun and the verb to its auxiliary.',
    score: (i, j) => {
      // tomar -> account, dekhte <-> pari, ami -> dekhte
      const bind: Record<number, number> = { 3: 4, 6: 7, 7: 6, 1: 6, 4: 3, 2: 7 };
      let s = -2.2 + (i === j ? 0.9 : 0);
      if (bind[i] === j) s += 5.2;
      return s;
    },
  },
  {
    id: 'lexical',
    name: 'Lexical',
    note: 'Ties the domain terms together — the pair that decides the intent.',
    score: (i, j) => {
      const domain = [4, 5];
      let s = -2.4 + (i === j ? 1.6 : 0);
      if (domain.includes(i) && domain.includes(j)) s += 4.8;
      if (domain.includes(j)) s += 1.4;
      return s;
    },
  },
  {
    id: 'aggregate',
    name: 'Aggregate',
    note: 'Pools the whole sentence into [CLS] — the vector the classifier reads.',
    score: (_i, j) => (j === 0 ? 4.4 : j === 9 ? 1.1 : -0.6),
  },
];

/** Row-wise softmax, exactly as attention normalises it. */
export function attnMatrix(head: AttnHead, n = attnTokens.length): number[][] {
  return Array.from({ length: n }, (_, i) => {
    const raw = Array.from({ length: n }, (_, j) => head.score(i, j));
    const max = Math.max(...raw);
    const exp = raw.map((v) => Math.exp(v - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map((v) => v / sum);
  });
}
