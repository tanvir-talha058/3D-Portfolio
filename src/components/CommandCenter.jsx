import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Search, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Brain, 
  Cpu, 
  FileText, 
  Briefcase, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  X,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { useCyberSound } from '../hooks/useCyberSound';

export default function CommandCenter({ 
  isOpen, 
  onClose, 
  onOpenRecruiter, 
  onOpenResume, 
  isLightMode, 
  toggleTheme,
  onTriggerInference
}) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { soundEnabled, toggleSound, playBeep, playSuccess, playWhoosh } = useCyberSound();

  const commands = [
    {
      id: 'rag-sim',
      category: 'AI Pipeline',
      icon: <Brain size={16} color="var(--cyan)" />,
      title: 'Stream Multilingual RAG Token Inference',
      desc: 'Simulate sub-45ms dense Qdrant vector retrieval + LLM response generation',
      action: () => {
        onClose();
        if (onTriggerInference) onTriggerInference('rag');
        const el = document.getElementById('playground');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
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
        const el = document.getElementById('playground');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
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
        const el = document.getElementById('playground');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'recruiter',
      category: 'Quick Overview',
      icon: <Briefcase size={16} color="var(--cyan)" />,
      title: 'Open Executive Recruiter Cheat Sheet',
      desc: 'View target roles, core stack, metrics, and instant recruiter highlights',
      action: () => {
        onClose();
        onOpenRecruiter();
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
      icon: soundEnabled ? <VolumeX size={16} color="#ef4444" /> : <Volume2 size={16} color="#10b981" />,
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
      action: () => {
        onClose();
        const el = document.getElementById('experience');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'goto-projects',
      category: 'Navigation',
      icon: <Code2 size={16} color="var(--cyan)" />,
      title: 'Jump to Production Projects & Case Studies',
      desc: 'CrimeMap BD, Deepfake Detection, Leaf Disease CNN, BhashaSetu',
      action: () => {
        onClose();
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        playWhoosh();
        document.body.style.overflow = 'hidden';
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      playBeep(600, 'sine', 0.02);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      playBeep(600, 'sine', 0.02);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        playSuccess();
        filteredCommands[selectedIndex].action();
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '1rem',
        maxWidth: '680px',
        width: 'min(92vw, 680px)',
        margin: 'auto',
        outline: 'none',
        maxHeight: '88vh',
        overflow: 'hidden'
      }}
    >
      <div
        className="glass-card"
        style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82vh'
        }}
      >
        {/* Top Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
          <Terminal size={20} color="var(--cyan)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search (e.g. 'RAG', 'Resume', 'Fraud', 'Experience')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '1.02rem',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            <span>ESC to close</span>
          </div>
        </div>

        {/* Telemetry Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 1.4rem', background: 'var(--terminal-bg)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          <span>NODE: <strong style={{ color: 'var(--cyan)' }}>TANVIR-AI-CORE</strong></span>
          <span>LATENCY: <strong style={{ color: '#059669' }}>28ms</strong></span>
          <span>AUDIO FX: <strong style={{ color: soundEnabled ? '#34d399' : 'var(--text-dim)' }}>{soundEnabled ? 'ACTIVE' : 'MUTED'}</strong></span>
        </div>

        {/* Results List */}
        <div style={{ overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
              No commands matching "{searchQuery}". Try "RAG", "CV", "Theme", or "Resume".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    playSuccess();
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-accent)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                    {cmd.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 600, color: isSelected ? 'var(--cyan)' : 'var(--text-main)' }}>
                        {cmd.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', background: 'var(--bg-surface-elevated)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                        {cmd.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cmd.desc}
                    </p>
                  </div>
                  <ArrowRight size={14} color={isSelected ? 'var(--cyan)' : 'var(--text-dim)'} style={{ opacity: isSelected ? 1 : 0.4, transform: isSelected ? 'translateX(3px)' : 'none', transition: 'all 0.15s ease' }} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.4rem', background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          <span>Use ↑↓ to navigate • ↵ to execute</span>
          <span>⚡ Tanvir AI Command Center</span>
        </div>
      </div>
    </dialog>
  );
}
