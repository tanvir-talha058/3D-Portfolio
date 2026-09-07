import React, { useState } from 'react';
import { BookOpen, Check, ExternalLink, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';
import PillBadge from './PillBadge';

export default function Research({ onToast }) {
  const [copiedId, setCopiedId] = useState(null);
  const researchItems = portfolioData?.research || [];

  const handleCopyBibtex = (item) => {
    const textToCopy = item.citation || item.bibtex || item.summary;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(item.id);
      if (onToast) {
        onToast(`Citation copied for ${item.title?.substring(0, 24)}...`, 'Quote');
      }
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <section id="research" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <BookOpen size={13} />
            <ScrambleText text="Academic Contributions" />
          </div>
          <h2 className="section-title">
            Research & <span className="gradient-text">Publications</span>
          </h2>
          <p className="section-subtitle">
            Advancing low-resource Natural Language Processing, computer vision deepfake detection,
            and curated agricultural benchmark datasets.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {researchItems.map((item, idx) => (
            <SpotlightCard
              key={item.id}
              reveal
              revealDelay={idx * 100}
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.5rem'
              }}
              className="research-card-grid"
            >
              <div>
                {/* Status and Year Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.85rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <PillBadge
                    as="span"
                    size="xs"
                    mono
                    style={{
                      fontWeight: 600,
                      background: item.badge?.includes('Published')
                        ? 'rgba(16, 185, 129, 0.12)'
                        : 'rgba(37, 99, 235, 0.12)',
                      color: item.badge?.includes('Published') ? '#059669' : 'var(--cyan)',
                      border: `1px solid ${item.badge?.includes('Published') ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-accent)'}`
                    }}
                  >
                    {item.badge || 'Research'}
                  </PillBadge>

                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {item.domain || item.venue || ''} • {item.period || item.year || ''}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)',
                    marginBottom: '0.65rem',
                    color: 'var(--text-main)'
                  }}
                >
                  {item.title}
                </h3>

                {/* Key Metric Highlight */}
                {item.keyMetric && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--cyan)',
                      marginBottom: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600
                    }}
                  >
                    ⚡ {item.keyMetric}
                  </div>
                )}

                {/* Summary */}
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65,
                    marginBottom: '1.25rem'
                  }}
                >
                  {item.summary}
                </p>

                {/* Details */}
                {item.details && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.55 }}>
                    {item.details}
                  </p>
                )}
              </div>

              {/* Action Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
                className="research-action-col"
              >
                <button
                  type="button"
                  onClick={() => handleCopyBibtex(item)}
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
                  title="Copy Citation"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={14} color="#059669" className="anim-pop" />
                      <span style={{ color: '#059669' }}>Citation Copied!</span>
                    </>
                  ) : (
                    <>
                      <Quote size={14} />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>

                {(item.doi || item.github) && (
                  <a
                    href={item.doi || item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    <ExternalLink size={14} />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .research-card-grid {
            grid-template-columns: 1fr 220px !important;
          }
        }
      `}</style>
    </section>
  );
}
