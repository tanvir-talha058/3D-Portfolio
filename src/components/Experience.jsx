import React from 'react';
import { Briefcase, Calendar, MapPin, Building2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';
import Reveal from './Reveal';
import { useInView } from '../hooks/useInView';
import ScrambleText from './ScrambleText';
import PillBadge from './PillBadge';

export default function Experience() {
  const experiences = portfolioData?.experience || [];

  // The spine only draws itself once the timeline is actually on screen.
  const [timelineRef, timelineInView] = useInView({ threshold: 0.05 });

  return (
    <section id="experience">
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <Briefcase size={13} />
            <ScrambleText text="Career Journey" />
          </div>
          <h2 className="section-title">
            Industry & <span className="gradient-text">Production Experience</span>
          </h2>
          <p className="section-subtitle">
            Deploying high-impact AI, automated engagement platforms, and banking technology at
            scale.
          </p>
        </Reveal>

        {/* Timeline container */}
        <div
          ref={timelineRef}
          style={{ maxWidth: '880px', marginInline: 'auto', position: 'relative' }}
        >
          {/* Vertical Timeline Line */}
          <div
            className={timelineInView ? 'timeline-line' : undefined}
            style={{
              position: 'absolute',
              top: '15px',
              bottom: '20px',
              left: '20px',
              width: '2px',
              background: 'var(--grad-primary-btn)',
              opacity: 0.4,
              transformOrigin: 'top',
              transform: timelineInView ? undefined : 'scaleY(0)'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {experiences.map((exp, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.75rem', position: 'relative' }}>
                {/* Timeline node */}
                <div
                  className="timeline-node"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface-elevated)',
                    border: '2px solid var(--cyan)',
                    color: 'var(--cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                    boxShadow: '0 0 15px var(--cyan-glow)',
                    animationDelay: `${idx * 0.35}s`
                  }}
                >
                  <Building2 size={18} />
                </div>

                {/* Experience Card */}
                <SpotlightCard
                  reveal
                  revealDelay={idx * 60}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                    border: '1px solid var(--border-medium)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          marginBottom: '0.2rem'
                        }}
                      >
                        {exp.role}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.4rem 0.5rem',
                          color: 'var(--cyan)',
                          fontWeight: 600,
                          fontSize: '0.95rem'
                        }}
                      >
                        <span>{exp.company}</span>
                        {exp.badge && (
                          <>
                            <span style={{ color: 'var(--text-dim)' }}>•</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              {exp.badge}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <PillBadge
                      size="md"
                      mono
                      style={{
                        background: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)'
                      }}
                      icon={<Calendar size={13} color="var(--cyan)" />}
                    >
                      <span>{exp.period}</span>
                    </PillBadge>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-dim)',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <MapPin size={14} />
                    <span>{exp.location}</span>
                  </div>

                  {/* Highlights */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {(exp.highlights || []).map((h, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          fontSize: '0.92rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.55
                        }}
                      >
                        <span style={{ color: '#059669', marginTop: '0.2rem', flexShrink: 0 }}>
                          ●
                        </span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack pills */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.45rem',
                      flexWrap: 'wrap',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    {(exp.tech || exp.skills || []).map((s, i) => (
                      <span key={i} className="tech-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
