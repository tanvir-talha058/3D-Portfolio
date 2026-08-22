export interface Education {
  degree: string;
  institution: string;
  period: string;
  coursework: string[];
}

export interface Publication {
  id: string;
  title: string;
  period: string;
  tags: string[];
  description: string;
}

export const education: Education = {
  degree: "B.Sc. in Computer Science & Engineering",
  institution: "Daffodil International University",
  period: "2022 — 2025",
  coursework: [
    "Object-Oriented Programming",
    "Databases",
    "Discrete Mathematics",
    "Data Structures and Algorithms",
    "Operating Systems",
    "Computer Networks",
    "Machine Learning and Data Mining",
    "Image Processing",
    "Computer Graphics",
    "System Design",
    "Software Engineering",
    "Information Security",
    "Statistics and Probability",
  ],
};

export const publications: Publication[] = [
  {
    id: "bangla-dialects",
    title: "Towards Automatic Classification and Translation of Bangla Regional Dialects in Low-Resource Settings",
    period: "2024 — Present",
    tags: ["NLP", "Deep Learning", "Transformer Models"],
    description:
      "Transformer-based NLP pipeline for Bangla regional dialect classification, trained on a 20,090-sample dataset across 8 dialects, achieving 86% accuracy.",
  },
  {
    id: "deepfake-detection",
    title: "Truth in Pixel: Deepfake Detection",
    period: "2024 — Present",
    tags: ["Computer Vision", "Deep Learning"],
    description:
      "Pixel-level inconsistency detection and artifact-based pipelines for manipulation detection.",
  },
  {
    id: "mbert-categorization",
    title: "Exploiting Transformer Architectures for Domain-Specific Text Categorization: The m-BERT Perspective",
    period: "2024 — 2025",
    tags: ["Transformer Learning", "NLP"],
    description: "Achieved benchmarking accuracy among existing works in domain-specific text categorization.",
  },
  {
    id: "plant-leaf-dataset",
    title: "Plant Leaf Disease Recognition Dataset",
    period: "2023 — 2024",
    tags: ["Mendeley Data", "Computer Vision"],
    description:
      "Curated and published 20,000+ annotated plant leaf images (zucchini, hibiscus, gourd, papaya) to support CV research.",
  },
  {
    id: "plant-leaf-cnn",
    title: "Deep Learning Models for Multi-Class Plant Leaf Disease Classification",
    period: "2023 — 2024",
    tags: ["CNN", "Image Classification"],
    description: "Trained multiple CNNs achieving validation accuracy exceeding 97% using augmentation and tuning.",
  },
];

export const awards = [
  "First Position — District Level Science Fair (Innovation Category)",
  "Third Position — Division Level Science Fair (Innovation Category)",
];
