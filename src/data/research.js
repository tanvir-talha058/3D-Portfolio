export const research = [
  {
    id: 'bangla-dialects',
    title:
      'Towards Automatic Classification and Translation of Bangla Regional Dialects in Low-Resource Settings',
    domain: 'Natural Language Processing, Deep Learning, Transformer Models',
    period: '2024 – Present',
    badge: 'Ongoing Research',
    keyMetric: '20,090 Samples across 8 Dialects',
    summary:
      'Designed and developed a transformer-based NLP pipeline for Bangla regional dialect classification and translation into standardized Bengali, leveraging a curated 20,090-sample dataset across 8 distinct dialects.',
    details:
      'Addresses low-resource NLP challenges for localized dialects (Chittagong, Sylhet, Noakhali, Barisal, etc.) using customized tokenization, cross-attention representations, and transfer learning with BanglaBERT and m-BERT.',
    citation: `@article{ahmed2024bangla,
  title={Towards Automatic Classification and Translation of Bangla Regional Dialects in Low-Resource Settings},
  author={Ahmed, Tanvir},
  year={2024}
}`
  },
  {
    id: 'deepfake',
    title: 'Truth in Pixel: Deepfake Detection via Inconsistency Analysis',
    domain: 'Computer Vision, Deep Learning, Digital Forensics',
    period: '2024 – Present',
    badge: 'Computer Vision',
    keyMetric: 'Pixel-Level Artifact & Boundary Analysis',
    summary:
      'Investigating pixel-level inconsistency detection and robust artifact-based deep learning pipelines to uncover subtle digital face-swaps and generative media manipulations.',
    details:
      'Focuses on high-frequency noise discrepancies, boundary blending artifacts, and physiological inconsistencies (eye blinking, lighting gradients) that evade traditional frame classifiers.',
    citation: `@article{ahmed2024truthinpixel,
  title={Truth in Pixel: Deepfake Detection via Inconsistency Analysis},
  author={Ahmed, Tanvir},
  year={2024}
}`
  },
  {
    id: 'mbert',
    title:
      'Exploiting Transformer Architectures for Domain-Specific Text Categorization: The m-BERT Perspective',
    domain: 'Transformer Learning, Deep Learning, NLP',
    period: '2024 – 2025',
    badge: 'Benchmark Accuracy',
    keyMetric: 'State-of-the-Art Benchmark Precision',
    summary:
      'Explores multilingual BERT fine-tuning techniques for highly specialized domain-specific categorization tasks, reaching benchmark accuracy exceeding prior baseline architectures.',
    details:
      'Demonstrates superior generalization when utilizing domain-adaptive pre-training combined with layer-wise discriminative learning rates.',
    citation: `@article{ahmed2025mbert,
  title={Exploiting Transformer Architectures for Domain-Specific Text Categorization: The m-BERT Perspective},
  author={Ahmed, Tanvir},
  year={2025}
}`
  },
  {
    id: 'leaf-dataset',
    title: 'Plant Leaf Disease Recognition Dataset',
    domain: 'Mendeley Data Repository, Computer Vision',
    period: '2023 – 2024',
    badge: 'Published Dataset',
    keyMetric: '20,000+ Annotated Leaf Images',
    summary:
      'Curated, processed, and published an open-access dataset of 20,000+ meticulously annotated plant leaf disease images (zucchini, hibiscus, gourd, papaya) to empower agricultural CV research.',
    details:
      'Dataset features high-resolution field captures with ground-truth agricultural pathology labels, enabling automated multi-class crop disease diagnostic benchmarking worldwide.',
    citation: `@data{ahmed2024leafdataset,
  title={Plant Leaf Disease Recognition Dataset},
  author={Ahmed, Tanvir},
  publisher={Mendeley Data},
  year={2024}
}`
  },
  {
    id: 'leaf-cnn',
    title: 'Deep Learning Models for Multi-Class Plant Leaf Disease Classification',
    domain: 'Convolutional Neural Networks, Image Classification',
    period: '2023 – 2024',
    badge: '>97% Accuracy',
    keyMetric: 'Validation Accuracy >97%',
    summary:
      'Trained and evaluated custom deep CNN architectures with advanced image augmentation and hyperparameter tuning, achieving over 97% validation accuracy across multiple plant species.',
    details:
      'Optimized model weights for mobile edge deployment to facilitate real-time, offline crop diagnosis for farmers in remote regions.',
    citation: `@article{ahmed2024leafcnn,
  title={Deep Learning Models for Multi-Class Plant Leaf Disease Classification},
  author={Ahmed, Tanvir},
  year={2024}
}`
  }
];
