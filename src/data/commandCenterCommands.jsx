import React from 'react';
import {
  Zap,
  ShieldCheck,
  Brain,
  Cpu,
  FileText,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Code2
} from 'lucide-react';

/**
 * Builds the AI Command Center's command list. A factory rather than a
 * static export because a couple of entries (theme, audio) swap their icon
 * and title based on live state, and every action needs the callbacks
 * CommandCenter received as props.
 */
export function getCommandCenterCommands({
  onClose,
  onOpenResume,
  onTriggerInference,
  toggleTheme,
  toggleSound,
  isLightMode,
  soundEnabled
}) {
  const jumpTo = (id) => {
    onClose();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return [
    {
      id: 'rag-sim',
      category: 'AI Pipeline',
      icon: <Brain size={16} color="var(--cyan)" />,
      title: 'Stream Multilingual RAG Token Inference',
      desc: 'Simulate sub-45ms dense Qdrant vector retrieval + LLM response generation',
      action: () => {
        onClose();
        if (onTriggerInference) onTriggerInference('rag');
        document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'fraud-sim',
      category: 'FinTech Engine',
      icon: <ShieldCheck size={16} color="#059669" />,
      title: 'Run Isolation Forest Fraud Risk Scoring',
      desc: 'Calculate transaction velocity anomaly score and ISO8583 rule validation',
      action: () => {
        onClose();
        if (onTriggerInference) onTriggerInference('fraud');
        document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'cv-sim',
      category: 'Vision AI',
      icon: <Cpu size={16} color="var(--violet)" />,
      title: 'Inspect YOLO & Crop Leaf CNN Classifier',
      desc: 'Evaluate 97%+ validation accuracy on 20,000+ multi-class dataset',
      action: () => {
        onClose();
        if (onTriggerInference) onTriggerInference('vision');
        document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'resume',
      category: 'Documents',
      icon: <FileText size={16} color="#38bdf8" />,
      title: 'Preview Curriculum Vitae (PDF)',
      desc: 'Direct PDF viewer with download and print options',
      action: () => {
        onClose();
        onOpenResume();
      }
    },
    {
      id: 'theme',
      category: 'System Environment',
      icon: isLightMode ? <Moon size={16} color="#818cf8" /> : <Sun size={16} color="#f59e0b" />,
      title: `Switch to ${isLightMode ? 'Night Mode (Obsidian)' : 'Day Mode (Clean Paper)'}`,
      desc: 'Toggle visual theme shading and contrast',
      action: () => {
        toggleTheme();
        onClose();
      }
    },
    {
      id: 'audio',
      category: 'System Environment',
      icon: soundEnabled ? (
        <VolumeX size={16} color="#ef4444" />
      ) : (
        <Volume2 size={16} color="#10b981" />
      ),
      title: `Turn Cybernetic Audio FX ${soundEnabled ? 'OFF' : 'ON'}`,
      desc: 'Web Audio API synthesized micro-feedback',
      action: () => {
        toggleSound();
      }
    },
    {
      id: 'goto-exp',
      category: 'Navigation',
      icon: <Zap size={16} color="var(--cyan)" />,
      title: 'Jump to Production Experience @ upay',
      desc: 'FinTech AI engineering, conversational systems & ETL history',
      action: () => jumpTo('experience')
    },
    {
      id: 'goto-projects',
      category: 'Navigation',
      icon: <Code2 size={16} color="var(--cyan)" />,
      title: 'Jump to Production Projects & Case Studies',
      desc: 'CrimeMap BD, Deepfake Detection, Leaf Disease CNN, BhashaSetu',
      action: () => jumpTo('projects')
    }
  ];
}
