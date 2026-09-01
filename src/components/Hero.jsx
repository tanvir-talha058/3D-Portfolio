import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Activity, 
  FileCode2,
  Download,
  Briefcase,
  Eye
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { portfolioData } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';
import InteractivePortrait from './InteractivePortrait';
import { useCountUp } from '../hooks/useCountUp';

function AnimatedMetric({ value, label, sub }) {
  let targetNum = 0;
  let prefix = '';
  let suffix = '';

  if (value.includes('32')) {
    targetNum = 32;
    suffix = 'x';
  } else if (value.includes('97')) {
    targetNum = 97;
    suffix = '%+';
  } else if (value.includes('20,000')) {
    targetNum = 20000;
    suffix = '+';
  } else if (value.includes('100')) {
    targetNum = 100;
    prefix = '<';
    suffix = 'ms';
  } else {
    targetNum = parseInt(value, 10) || 0;
  }

  const { display, elementRef } = useCountUp(targetNum, 1800, suffix, prefix);

  return (
    <SpotlightCard
      style={{
        padding: '1.4rem 1rem',
        textAlign: 'center'
      }}
    >
      <div 
        ref={elementRef}
        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }} 
        className="gradient-text"
      >
        {display || value}
      </div>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
        {sub}
      </div>
    </SpotlightCard>
  );
}

export default function Hero({ onOpenRecruiter, onOpenResume }) {
  const roles = [
    "AI / ML Engineer",
    "Multilingual RAG Architect",
    "Computer Vision Researcher",
    "FinTech Intelligence Specialist",
    "Full-Stack ML Systems Developer"
  ];
  
  const [roleIdx, setRoleIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIdx];
    const typeSpeed = isDeleting ? 30 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting && typedText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setRoleIdx((prev) => (prev + 1) % roles.length);
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
    <section id="hero" style={{ minHeight: '100vh', paddingTop: 'calc(var(--nav-height) + 1.5rem)', paddingBottom: '3.5rem', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', alignItems: 'center' }} className="hero-main-grid">
          
          {/* Left Column: Headline & Intro */}
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#059669',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
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
                <span>{portfolioData.personal.status}</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 500
                }}
              >
                <Zap size={12} color="var(--cyan)" />
                <span>{portfolioData.personal.currentRole}</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 style={{ fontSize: 'clamp(2.1rem, 5.5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em', wordBreak: 'break-word' }}>
              Hi, I'm <span className="gradient-text">{portfolioData.personal.name}</span>
              <br />
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>
                {typedText}
                <span style={{ borderRight: '2.5px solid var(--cyan)', paddingRight: '2px', animation: 'blinkCursor 0.8s infinite' }} />
              </span>
            </h1>

            {/* Bio Paragraph */}
            <p style={{ fontSize: 'clamp(0.98rem, 2.5vw, 1.12rem)', color: 'var(--text-muted)', lineHeight: 1.68, marginBottom: '2rem', maxWidth: '640px' }}>
              {portfolioData.personal.bio}
            </p>

            {/* CTA Group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }} className="hero-cta-group">
              <button
                type="button"
                onClick={onOpenRecruiter}
                className="btn btn-primary btn-animated"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Briefcase size={15} />
                <span>Recruiter Cheat Sheet</span>
              </button>

              <button
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <a
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="hover-lift"
              >
                <GithubIcon size={14} />
                <span>GitHub</span>
              </a>

              <a
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="hover-lift"
              >
                <LinkedinIcon size={14} />
                <span>LinkedIn</span>
              </a>

              <a
                href={`mailto:${portfolioData.personal.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="hover-lift"
              >
                <Mail size={14} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Executive AI Engineer Portrait */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <InteractivePortrait />
          </div>

        </div>

        {/* Metrics Row with CountUp and Spotlight 3D Tilt */}
        <div style={{ marginTop: '3.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {portfolioData.metrics.map((metric, idx) => (
            <AnimatedMetric
              key={idx}
              value={metric.value}
              label={metric.label}
              sub={metric.sub}
            />
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
      `}</style>
    </section>
  );
}
