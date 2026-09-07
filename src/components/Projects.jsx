import React, { useState } from 'react';
import { FolderGit2, ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import { portfolioData } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';

export default function Projects({ onSelectProject }) {
  const [filter, setFilter] = useState('All');

  const categories = [
    'All',
    'Generative AI',
    'Computer Vision',
    'Full-Stack & Cloud',
    'Core Systems'
  ];
  const projectList = portfolioData?.projects || [];

  const filteredProjects =
    filter === 'All'
      ? projectList
      : projectList.filter((p) => {
          if (filter === 'Generative AI')
            return (
              (p.category || []).includes('ai') ||
              p.summary?.toLowerCase().includes('rag') ||
              p.title?.toLowerCase().includes('ai')
            );
          if (filter === 'Computer Vision')
            return (p.category || []).includes('cv') || p.badge?.includes('Vision');
          if (filter === 'Full-Stack & Cloud')
            return (
              (p.category || []).includes('web') ||
              p.badge?.includes('Geospatial') ||
              p.badge?.includes('Ecosystem')
            );
          if (filter === 'Core Systems')
            return (
              (p.category || []).includes('lang') ||
              p.badge?.includes('System') ||
              p.badge?.includes('Automation')
            );
          return true;
        });

  const getCategoryCount = (cat) => {
    if (cat === 'All') return projectList.length;
    return projectList.filter((p) => {
      if (cat === 'Generative AI')
        return (
          (p.category || []).includes('ai') ||
          p.summary?.toLowerCase().includes('rag') ||
          p.title?.toLowerCase().includes('ai')
        );
      if (cat === 'Computer Vision')
        return (p.category || []).includes('cv') || p.badge?.includes('Vision');
      if (cat === 'Full-Stack & Cloud')
        return (
          (p.category || []).includes('web') ||
          p.badge?.includes('Geospatial') ||
          p.badge?.includes('Ecosystem')
        );
      if (cat === 'Core Systems')
        return (
          (p.category || []).includes('lang') ||
          p.badge?.includes('System') ||
          p.badge?.includes('Automation')
        );
      return true;
    }).length;
  };

  return (
    <section id="projects">
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <FolderGit2 size={13} />
            <ScrambleText text="Featured Engineering" />
          </div>
          <h2 className="section-title">
            Production AI & <span className="gradient-text">Software Systems</span>
          </h2>
          <p className="section-subtitle">
            From high-throughput geospatial ETL architectures to enterprise computer vision and
            multilingual RAG platforms.
          </p>
        </Reveal>

        {/* Filter Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            paddingInline: '0.5rem'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
              aria-pressed={filter === cat}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 1.1rem',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{cat}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  opacity: filter === cat ? 0.9 : 0.6,
                  fontFamily: 'var(--font-mono)'
                }}
              >
                ({getCategoryCount(cat)})
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
            gap: '1.75rem'
          }}
        >
          {filteredProjects.map((project, idx) => (
            <SpotlightCard
              key={`${filter}-${project.id}`}
              onClick={() => onSelectProject && onSelectProject(project)}
              reveal
              revealDelay={(idx % 6) * 80}
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div>
                {/* Card Top Category & Impact */}
                <div
                  className="depth-near"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--cyan)',
                      fontWeight: 600
                    }}
                  >
                    {project.badge || 'Engineering'}
                  </span>

                  {project.metrics && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#059669',
                        fontWeight: 700
                      }}
                    >
                      {project.metrics.split('•')[0]}
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3
                  className="depth-mid"
                  style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-main)' }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  className="depth-far"
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    marginBottom: '1.25rem'
                  }}
                >
                  {project.summary || project.description}
                </p>

                {/* Highlights List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  {(project.highlights || []).slice(0, 2).map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-dim)'
                      }}
                    >
                      <span style={{ color: 'var(--cyan)', marginTop: '0.1rem' }}>▹</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack & Action Buttons */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.35rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.5rem'
                  }}
                >
                  {(project.tech || []).slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      className="tech-tag"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    >
                      {t}
                    </span>
                  ))}
                  {(project.tech || []).length > 4 && (
                    <span
                      className="tech-tag"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    >
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectProject) onSelectProject(project);
                    }}
                    className="btn btn-outline btn-sm open-project-modal"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <span>Deep Dive</span>
                    <ArrowRight size={13} />
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-outline btn-icon"
                        style={{ width: '32px', height: '32px' }}
                        aria-label="GitHub Repository"
                        title="GitHub Repository"
                      >
                        <GithubIcon size={14} />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-outline btn-icon"
                        style={{ width: '32px', height: '32px' }}
                        aria-label="Live Demo"
                        title="Live Demo"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
