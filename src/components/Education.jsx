import React from 'react';
import { GraduationCap, Trophy, Calendar, MapPin } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';
import PillBadge from './PillBadge';

export default function Education() {
  return (
    <section id="education">
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <GraduationCap size={13} />
            <ScrambleText text="Academic Background" />
          </div>
          <h2 className="section-title">
            Education & <span className="gradient-text">Recognitions</span>
          </h2>
          <p className="section-subtitle">
            Strong foundations in computer systems, mathematics, and algorithmic problem-solving.
          </p>
        </Reveal>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}
          className="edu-grid"
        >
          {/* Left: Degrees */}
          <Reveal variant="left">
            <h3
              style={{
                fontSize: '1.45rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <GraduationCap size={20} color="var(--cyan)" />
              <span>Academic Credentials</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {portfolioData.education.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card hover-lift-accent"
                  style={{ padding: '1.75rem' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginBottom: '0.4rem'
                    }}
                  >
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
                      {item.institution}
                    </h4>
                    <PillBadge
                      as="span"
                      size="xs"
                      mono
                      style={{
                        background: 'rgba(0, 240, 255, 0.1)',
                        color: 'var(--cyan)',
                        border: '1px solid rgba(0, 240, 255, 0.25)'
                      }}
                    >
                      {item.badge}
                    </PillBadge>
                  </div>

                  <div
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: 'var(--cyan)',
                      marginBottom: '0.6rem'
                    }}
                  >
                    {item.degree}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-dim)',
                      marginBottom: '0.85rem'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} /> {item.period}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} /> {item.location}
                    </span>
                  </div>

                  {item.coursework && (
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-dim)',
                        lineHeight: 1.55,
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                    >
                      <strong style={{ color: 'var(--text-muted)' }}>Relevant Coursework: </strong>
                      {item.coursework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: Awards & Honors */}
          <Reveal variant="right" delay={140}>
            <h3
              style={{
                fontSize: '1.45rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Trophy size={20} color="var(--amber)" />
              <span>Honors & Achievements</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {portfolioData.awards.map((award, idx) => (
                <div
                  key={idx}
                  className="glass-card hover-lift-accent"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                    '--hover-accent': 'var(--amber)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: 'var(--amber)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Trophy size={22} />
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-main)',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {award.title}
                    </h4>
                    <div
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--cyan)',
                        fontFamily: 'var(--font-mono)',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {award.category} • {award.organization}
                    </div>
                    <p
                      style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}
                    >
                      {award.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .edu-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
}
