import React, { useState } from 'react';
import { 
  Cpu, 
  Brain, 
  Layers, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Workflow, 
  Code2, 
  Server,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function HeroSkillsMatrix() {
  const [activeTab, setActiveTab] = useState('stack'); // 'stack' | 'telemetry' | 'highlights'

  const skillPillars = [
    {
      icon: <Brain size={17} />,
      color: 'var(--cyan)',
      title: 'Generative AI & Multilingual RAG',
      level: 'Expert',
      tags: ['Qdrant', 'LangChain', 'BM25', 'CrossEncoder'],
      metric: '<45ms Latency'
    },
    {
      icon: <Cpu size={17} />,
      color: 'var(--violet)',
      title: 'Computer Vision & Document AI',
      level: 'Advanced',
      tags: ['MediaPipe', 'OpenCV', 'YOLOv8', 'CNNs'],
      metric: '97%+ Accuracy'
    },
    {
      icon: <ShieldCheck size={17} />,
      color: '#059669',
      title: 'FinTech Risk & Fraud Anomaly Engine',
      level: 'Specialist',
      tags: ['Isolation Forest', 'Velocity Risk', 'ISO8583'],
      metric: '0.001 FLR'
    },
    {
      icon: <Workflow size={17} />,
      color: 'var(--amber)',
      title: 'High-Throughput Parallel ETL & APIs',
      level: 'Mastery',
      tags: ['Python', 'PostgreSQL', 'FastAPI', 'Vercel'],
      metric: '32x Speedup'
    }
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', marginBottom: '1.1rem', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} />
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              background: activeTab === 'stack' ? 'var(--cyan)' : 'transparent',
              color: activeTab === 'stack' ? 'var(--btn-text-color)' : 'var(--text-dim)',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={12} />
            <span>AI Capabilities</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('telemetry')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              background: activeTab === 'telemetry' ? 'var(--cyan)' : 'transparent',
              color: activeTab === 'telemetry' ? 'var(--btn-text-color)' : 'var(--text-dim)',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            <Terminal size={12} />
            <span>Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI Capabilities & Technical Pillars */}
      {activeTab === 'stack' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
          {skillPillars.map((pillar, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.75rem 0.95rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--terminal-row-bg)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease'
              }}
              className="skill-card-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ color: pillar.color, display: 'flex', alignItems: 'center' }}>
                    {pillar.icon}
                  </div>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {pillar.title}
                  </h4>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: pillar.color,
                    background: 'rgba(37, 99, 235, 0.08)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}
                >
                  {pillar.metric}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                {pillar.tags.map((t, i) => (
                  <span key={i} className="tech-tag" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Quick status bar */}
          <div style={{ marginTop: '0.5rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            <span>Specialization: <strong style={{ color: 'var(--cyan)' }}>Multilingual RAG & FinTech AI</strong></span>
            <span style={{ color: '#059669', fontWeight: 600 }}>● Production Ready</span>
          </div>
        </div>
      )}

      {/* TAB 2: Production Pipeline Telemetry */}
      {activeTab === 'telemetry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.8rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--terminal-row-bg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Cpu size={17} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.15rem', color: 'var(--text-main)' }}>Speech-to-Text & Multilingual LLM</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Conversational AI Outbound @ upay</p>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#059669', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0, fontWeight: 600 }}>
              ACTIVE
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.8rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--terminal-row-bg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Layers size={17} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.15rem', color: 'var(--text-main)' }}>Hybrid RAG (Qdrant + BM25)</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Bangla/Banglish/English Vector Index</p>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', background: 'rgba(37, 99, 235, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0, fontWeight: 600 }}>
              &lt;45ms
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.8rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--terminal-row-bg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={17} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.15rem', color: 'var(--text-main)' }}>Real-time Fraud Anomaly Scorer</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Velocity & Risk Evaluation</p>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#059669', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0, fontWeight: 600 }}>
              0.001 FLR
            </div>
          </div>

          {/* Status footer */}
          <div style={{ marginTop: '0.5rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-dim)' }}>Cluster: <span style={{ color: 'var(--cyan)' }}>healthy</span></span>
            <span style={{ color: 'var(--text-dim)' }}>Throughput: <span style={{ color: '#059669' }}>99.98% SLA</span></span>
          </div>
        </div>
      )}

      <style>{`
        .skill-card-hover:hover {
          border-color: var(--border-accent) !important;
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
}
