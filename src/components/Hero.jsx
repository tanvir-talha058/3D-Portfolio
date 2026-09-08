import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Zap, Eye } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { portfolioData } from '../data/portfolioData';
import InteractivePortrait from './InteractivePortrait';
import { useScrollParallax } from '../hooks/useScrollParallax';
import { useMagneticHover } from '../hooks/useMagneticHover';
import PillBadge from './PillBadge';

const ROLES = [
  'AI / ML Engineer',
  'Multilingual RAG Architect',
  'Computer Vision Researcher',
  'FinTech Intelligence Specialist',
  'Full-Stack ML Systems Developer'
];

const IMPACT_METRICS = [
  {
    value: '32x',
    label: 'ETL Pipeline Speedup',
    detail: 'Async parallel ingestion & spatial indexing',
    badge: 'Scale'
  },
  {
    value: '<50ms',
    label: 'Multilingual RAG Latency',
    detail: 'Dense Qdrant + Sparse BM25 hybrid search',
    badge: 'Latency'
  },
  {
    value: '99.0%',
    label: 'Fraud Detection Precision',
    detail: 'Real-time velocity & anomaly scoring at upay',
    badge: 'FinTech'
  },
  {
    value: '5+',
    label: 'Peer-Reviewed Works',
    detail: 'NLP, Low-Resource Transformers & CV',
    badge: 'Research'
  }
];

export default function Hero({ onOpenResume }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const parallaxRef = useScrollParallax({ speed: 0.12, max: 36 });
  const magneticRef = useMagneticHover();

  useEffect(() => {
    const currentRole = ROLES[roleIdx];

    // Fully typed: hold the finished role on screen before deleting it.
    // This pause needs its own cleanup, otherwise it outlives the effect.
    if (!isDeleting && typedText === currentRole) {
      const pause = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(pause);
    }

    const typeSpeed = isDeleting ? 30 : 80;
    const timer = setTimeout(() => {
      if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setRoleIdx((prev) => (prev + 1) % ROLES.length);
      } else {
        setTypedText(
          isDeleting
            ? currentRole.substring(0, typedText.length - 1)
            : currentRole.substring(0, typedText.length + 1)
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIdx]);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        paddingTop: 'calc(var(--nav-height) + 1.5rem)',
        paddingBottom: '3.5rem',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'center'
          }}
          className="hero-main-grid"
        >
          {/* Left Column: Headline & Intro */}
          <div>
            {/* Badges */}
            <div
              className="anim-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                animationDelay: '0.05s'
              }}
            >
              <PillBadge
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: 'var(--emerald)',
                  fontWeight: 600
                }}
                icon={
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--emerald)',
                      boxShadow: '0 0 8px var(--emerald)',
                      animation: 'pulseDot 2s infinite ease-in-out',
                      flexShrink: 0
                    }}
                  />
                }
              >
                <span>{portfolioData.personal.status}</span>
              </PillBadge>

              <PillBadge
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                  fontWeight: 600
                }}
                icon={<Zap size={12} color="var(--cyan)" />}
              >
                <span>{portfolioData.personal.currentRole}</span>
              </PillBadge>
            </div>

            {/* Main Title */}
            <h1
              className="anim-up"
              style={{
                fontSize: 'clamp(2.1rem, 5.5vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
                wordBreak: 'break-word',
                animationDelay: '0.16s'
              }}
            >
              Hi, I'm <span className="gradient-text">{portfolioData.personal.name}</span>
              <br />
              <span className="sr-only">{ROLES.join(', ')}</span>
              <span aria-hidden="true" style={{ color: 'var(--cyan)', fontWeight: 700 }}>
                {typedText}
                <span
                  style={{
                    borderRight: '2.5px solid var(--cyan)',
                    paddingRight: '2px',
                    animation: 'blinkCursor 0.8s infinite'
                  }}
                />
              </span>
            </h1>

            {/* Bio Paragraph */}
            <p
              className="anim-up"
              style={{
                fontSize: 'clamp(0.98rem, 2.5vw, 1.12rem)',
                color: 'var(--text-muted)',
                lineHeight: 1.68,
                marginBottom: '2rem',
                maxWidth: '640px',
                animationDelay: '0.28s'
              }}
            >
              {portfolioData.personal.bio}
            </p>

            {/* CTA Group */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
                marginBottom: '2rem',
                animationDelay: '0.4s'
              }}
              className="hero-cta-group anim-up"
            >
              <button
                ref={magneticRef}
                type="button"
                onClick={onOpenResume}
                className="btn btn-outline"
              >
                <Eye size={15} />
                <span>Preview CV</span>
              </button>

              <a href="#projects" className="btn btn-outline">
                <span>Explore Work</span>
                <ArrowRight size={15} />
              </a>

              <a href="#contact" className="btn btn-outline">
                <Mail size={15} />
                <span>Contact</span>
              </a>
            </div>

            {/* Social Links */}
            <div
              className="anim-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                flexWrap: 'wrap',
                animationDelay: '0.52s'
              }}
            >
              <PillBadge
                as="a"
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="hover-lift"
                icon={<GithubIcon size={14} />}
              >
                <span>GitHub</span>
              </PillBadge>

              <PillBadge
                as="a"
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="hover-lift"
                icon={<LinkedinIcon size={14} />}
              >
                <span>LinkedIn</span>
              </PillBadge>

              <PillBadge
                as="a"
                href={`mailto:${portfolioData.personal.email}`}
                size="md"
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="hover-lift"
                icon={<Mail size={14} />}
              >
                <span>Email</span>
              </PillBadge>
            </div>
          </div>

          {/* Right Column: Interactive Executive AI Engineer Portrait */}
          <div
            className="anim-right"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              animationDelay: '0.32s'
            }}
          >
            {/* Separate node from the entrance-animation wrapper above — a CSS
                animation's transform would otherwise fight this scroll-driven
                inline one on the same element. */}
            <div ref={parallaxRef}>
              <InteractivePortrait />
            </div>
          </div>
        </div>

        {/* Executive Impact Metrics Strip */}
        <div
          className="anim-up hero-metrics-strip"
          style={{
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem',
            animationDelay: '0.62s'
          }}
        >
          {IMPACT_METRICS.map((item, idx) => (
            <div
              key={idx}
              className="glass-card hero-metric-card"
              style={{
                padding: '1.15rem 1.35rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-main)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                  className="gradient-text"
                >
                  {item.value}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--cyan-glow)',
                    border: '1px solid var(--border-accent)',
                    color: 'var(--cyan)'
                  }}
                >
                  {item.badge}
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.01em'
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  lineHeight: 1.45
                }}
              >
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-main-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
        }
        @media (max-width: 480px) {
          .hero-cta-group .btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          border-color: var(--cyan) !important;
          color: var(--cyan) !important;
        }
        .hero-metric-card:hover {
          transform: translateY(-3px);
          border-color: var(--cyan) !important;
          box-shadow: 0 8px 24px -6px var(--cyan-glow);
        }
      `}</style>
    </section>
  );
}
