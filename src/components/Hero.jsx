import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Zap, Briefcase, Eye } from 'lucide-react';
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

export default function Hero({ onOpenRecruiter, onOpenResume }) {
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
                  color: '#059669',
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
                  color: 'var(--text-muted)'
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
                onClick={onOpenRecruiter}
                className="btn btn-primary btn-animated"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Briefcase size={15} />
                <span>Recruiter Cheat Sheet</span>
              </button>

              <button type="button" onClick={onOpenResume} className="btn btn-outline">
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
      `}</style>
    </section>
  );
}
