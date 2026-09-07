import React, { useState } from 'react';
import { Code2, Cpu, Brain, Sparkles, Server } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';
import SkillBar from './SkillBar';

export default function Skills() {
  const [selectedCat, setSelectedCat] = useState('all');

  const categories = portfolioData?.skills?.categories || [
    { id: 'all', name: 'All Technologies' },
    { id: 'ai', name: 'Generative AI & LLMs' },
    { id: 'cv', name: 'Computer Vision & Media' },
    { id: 'web', name: 'Full-Stack & Cloud' },
    { id: 'lang', name: 'Languages & Core Tools' }
  ];

  const items = portfolioData?.skills?.items || [];

  const filteredItems =
    selectedCat === 'all' ? items : items.filter((item) => item.category === selectedCat);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'lang':
        return <Code2 size={18} />;
      case 'ai':
        return <Brain size={18} />;
      case 'cv':
        return <Cpu size={18} />;
      case 'web':
        return <Server size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  return (
    <section id="skills" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <Cpu size={13} />
            <ScrambleText text="Technical Competencies" />
          </div>
          <h2 className="section-title">
            Skills & <span className="gradient-text">Engineering Arsenal</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive overview of programming languages, deep learning frameworks, and
            infrastructure tools I use to build scalable systems.
          </p>
        </Reveal>

        {/* Filter Category Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap'
          }}
        >
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? items.length
                : items.filter((item) => item.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`btn btn-sm ${selectedCat === cat.id ? 'btn-primary' : 'btn-outline'}`}
                aria-pressed={selectedCat === cat.id}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1.1rem',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>{cat.name}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    opacity: selectedCat === cat.id ? 0.9 : 0.6,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredItems.map((skill, idx) => (
            <SpotlightCard
              key={`${selectedCat}-${skill.name || idx}`}
              reveal
              revealDelay={(idx % 8) * 70}
              style={{
                padding: '1.35rem 1.25rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div
                  className="depth-near"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.65rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--cyan)'
                    }}
                  >
                    {getCategoryIcon(skill.category)}
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        color: 'var(--text-dim)'
                      }}
                    >
                      {skill.level || 'Advanced'}
                    </span>
                  </div>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--emerald)'
                    }}
                  />
                </div>

                <h3
                  className="depth-mid"
                  style={{
                    fontSize: '1.05rem',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    marginBottom: '0.35rem'
                  }}
                >
                  {skill.name}
                </h3>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {skill.desc}
                </p>

                <SkillBar level={skill.level || 'Advanced'} delay={(idx % 8) * 70} />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
