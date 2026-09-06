import React, { useEffect, useRef } from 'react';
import { X, Briefcase, Download, Mail, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { useCountUp } from '../hooks/useCountUp';
import IconButton from './IconButton';
import PillBadge from './PillBadge';

/**
 * One headline figure. The number eases up from zero the first time the tile
 * becomes visible, which is when the recruiter modal opens.
 */
function MetricTile({ metric }) {
  const { display, elementRef } = useCountUp(
    metric.targetNum ?? 0,
    1500,
    metric.suffix || '',
    metric.prefix || ''
  );

  return (
    <div
      style={{
        background: 'var(--bg-surface-elevated)',
        padding: '0.85rem 0.6rem',
        borderRadius: 'var(--radius-sm)',
        textAlign: 'center',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div
        ref={elementRef}
        style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--cyan)',
          fontFamily: 'var(--font-heading)'
        }}
      >
        {metric.targetNum == null ? metric.value : display}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
        {metric.label}
      </div>
    </div>
  );
}

export default function RecruiterModal({ isOpen, onClose, onOpenResume }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const recruiter = portfolioData?.recruiterCheatSheet || {};
  const targetRoles = recruiter.targetRoles || [
    'AI/ML Engineer',
    'LLM / RAG Architect',
    'Computer Vision Specialist'
  ];
  const highlights = recruiter.topHighlights || recruiter.keyHighlights || [];
  const coreLanguages = recruiter.techStackSummary?.coreLanguages || [
    'Python',
    'SQL',
    'C++',
    'JavaScript',
    'Dart'
  ];
  const aiFrameworks = recruiter.techStackSummary?.aiFrameworks || [
    'PyTorch',
    'Transformers',
    'LangChain',
    'OpenCV',
    'Qdrant'
  ];

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '1rem',
        maxWidth: '860px',
        width: 'min(94vw, 860px)',
        margin: 'auto',
        outline: 'none',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}
    >
      <div
        className="glass-card"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <IconButton
          icon={<X size={18} />}
          onClick={onClose}
          aria-label="Close modal"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}
        />

        {/* Header Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap'
          }}
        >
          <div className="section-tag" style={{ margin: 0 }}>
            <Briefcase size={12} />
            <span>Recruiter Quick Overview</span>
          </div>
          <PillBadge
            size="sm"
            mono
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--emerald-light)'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--emerald)'
              }}
            />
            <span>{portfolioData.personal.availability}</span>
          </PillBadge>
        </div>

        {/* Candidate Title with Avatar */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}
        >
          <picture>
            <source srcSet="/avatar-160.webp" type="image/webp" />
            <img
              src="/avatar-160.png"
              alt={portfolioData.personal.name}
              width="74"
              height="74"
              loading="lazy"
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '2px solid var(--cyan)',
                boxShadow: '0 0 16px var(--cyan-glow)'
              }}
            />
          </picture>
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 800,
                marginBottom: '0.25rem',
                color: 'var(--text-main)'
              }}
            >
              {portfolioData.personal.name}
            </h2>
            <div
              style={{
                fontSize: '0.88rem',
                color: 'var(--cyan)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)'
              }}
            >
              {targetRoles.join(' • ')} • {portfolioData.personal.experienceYears}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(130px, 100%), 1fr))',
            gap: '0.75rem',
            marginBottom: '1.75rem'
          }}
        >
          {(portfolioData.metrics || []).map((m, idx) => (
            <MetricTile key={idx} metric={m} />
          ))}
        </div>

        {/* Production & Research Highlights */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4
            style={{
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              marginBottom: '0.75rem'
            }}
          >
            Production & Research Highlights:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  fontSize: '0.88rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.5
                }}
              >
                <span style={{ color: 'var(--cyan)', marginTop: '0.15rem', flexShrink: 0 }}>✓</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stack at a Glance */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.1rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <h4
            style={{
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              marginBottom: '0.65rem'
            }}
          >
            Core Stack at a Glance:
          </h4>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {[...coreLanguages, ...aiFrameworks].map((sk, i) => (
              <span
                key={i}
                className="tech-tag"
                style={{ background: 'var(--bg-card)', fontSize: '0.78rem' }}
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
          className="recruiter-modal-ctas"
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenResume) onOpenResume();
            }}
            className="btn btn-primary"
          >
            <Download size={15} />
            <span>Preview Full PDF Resume</span>
          </button>

          <a href={`mailto:${portfolioData.personal.email}`} className="btn btn-outline">
            <Mail size={15} />
            <span>Direct Email</span>
          </a>

          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ marginLeft: 'auto' }}
          >
            <ExternalLink size={15} />
            <span>LinkedIn Profile</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .recruiter-modal-ctas .btn {
            width: 100% !important;
            justify-content: center !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </dialog>
  );
}
