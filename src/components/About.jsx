import React from 'react';
import { Cpu, Brain, Database, ShieldCheck, Workflow, Sparkles, Code2, Rocket } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';
import { portfolioData } from '../data/portfolioData';

export default function About() {
  const pillars = [
    {
      icon: <Brain size={22} />,
      title: 'Generative AI & Multilingual RAG',
      desc: 'Specialized in sub-50ms hybrid vector search (Dense Qdrant + Sparse BM25), CrossEncoder reranking, and low-resource multilingual NLP architectures.'
    },
    {
      icon: <Cpu size={22} />,
      title: 'Computer Vision & Document AI',
      desc: 'Deep experience in real-time landmark tracking (MediaPipe), YOLO object detection, and CNN document recognition & preprocessing.'
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'FinTech Intelligence & Fraud ML',
      desc: 'Architecting high-throughput velocity anomaly detection, behavioral fraud signals, and ISO8583 banking gateway ML integrations at upay.'
    },
    {
      icon: <Workflow size={22} />,
      title: 'High-Throughput Engineering',
      desc: 'Building parallel asynchronous ETL pipelines (32x speedups), serverless backends with sub-100ms latency, and automated testing suites.'
    }
  ];

  return (
    <section id="about" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <Sparkles size={13} />
            <ScrambleText text="Engineering Philosophy" />
          </div>
          <h2 className="section-title">
            Bridging Cutting-Edge <span className="gradient-text">AI Research</span> with Scalable
            Production
          </h2>
          <p className="section-subtitle">
            From low-resource multilingual transformer research to high-volume FinTech intelligence
            systems serving millions.
          </p>
        </Reveal>

        {/* Narrative Box with Portrait Thumbnail */}
        <SpotlightCard
          reveal
          style={{
            padding: 'clamp(1.5rem, 3.5vw, 2.75rem)',
            marginBottom: '3.5rem',
            border: '1px solid var(--border-medium)'
          }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
            className="about-narrative-grid"
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <picture>
                  <source srcSet="/avatar-160.webp" type="image/webp" />
                  <img
                    src="/avatar-160.png"
                    alt={portfolioData.personal.name}
                    width="60"
                    height="60"
                    loading="lazy"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--cyan)',
                      boxShadow: '0 0 14px var(--cyan-glow)'
                    }}
                  />
                </picture>
                <div>
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      color: 'var(--text-main)',
                      marginBottom: '0.15rem'
                    }}
                  >
                    {portfolioData.personal.name}
                  </h3>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--cyan)'
                    }}
                  >
                    AI/ML Engineer (Officer) @ upay (UCB Fintech)
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}
              >
                I specialize in designing and deploying end-to-end intelligent systems. My work
                spans full-lifecycle machine learning — from curating large-scale multi-class
                datasets and fine-tuning transformer models, to deploying sub-100ms APIs and
                resilient microservices in banking and financial technology.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                Currently at <strong style={{ color: 'var(--cyan)' }}>upay (UCB Fintech)</strong>, I
                lead conversational outbound AI initiatives and automated payment systems, combining
                modern LLMs, hybrid vector databases, and robust statistical anomaly detection.
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: 'var(--cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Code2 size={20} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-dim)'
                    }}
                  >
                    PRIMARY STACK
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Python, PyTorch, Transformers, Qdrant, SQL
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Rocket size={20} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-dim)'
                    }}
                  >
                    IMPACT HIGHLIGHT
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    32x Speedup & 91 Automated Tests on CrimeMap BD
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(79, 70, 229, 0.1)',
                    color: 'var(--violet)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Database size={20} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-dim)'
                    }}
                  >
                    DATASET PUBLICATION
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    20,000+ Leaf Disease Dataset on Mendeley Data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* 4 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
            gap: '1.5rem'
          }}
        >
          {pillars.map((pillar, idx) => (
            <SpotlightCard
              key={idx}
              reveal
              revealDelay={idx * 90}
              style={{
                padding: '1.75rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                {pillar.icon}
              </div>
              <h4
                style={{ fontSize: '1.1rem', marginBottom: '0.65rem', color: 'var(--text-main)' }}
              >
                {pillar.title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {pillar.desc}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .about-narrative-grid {
            grid-template-columns: 1.35fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
}
