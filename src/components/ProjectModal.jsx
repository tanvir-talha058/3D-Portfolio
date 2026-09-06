import React, { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';
import ArchitectureDiagram from './ArchitectureDiagram';
import IconButton from './IconButton';

export default function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!project) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [project]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '1rem',
        maxWidth: '960px',
        width: 'min(94vw, 960px)',
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
        {/* Close button */}
        <IconButton
          icon={<X size={18} />}
          onClick={onClose}
          aria-label="Close modal"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}
        />

        {/* Header tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div className="section-tag" style={{ margin: 0 }}>
            <span>{project.badge || 'Engineering'}</span>
          </div>
          {project.metrics && (
            <span
              style={{
                fontSize: '0.82rem',
                color: 'var(--cyan)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600
              }}
            >
              {project.metrics}
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            marginBottom: '0.85rem',
            color: 'var(--text-main)'
          }}
        >
          {project.title}
        </h2>
        <p
          style={{
            fontSize: '1.02rem',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '1.75rem'
          }}
        >
          {project.summary || project.description || project.longDesc}
        </p>

        {/* End-to-End System Pipeline Diagram */}
        {project.architectureNodes && (
          <div style={{ marginBottom: '2rem' }}>
            <ArchitectureDiagram nodes={project.architectureNodes} />
          </div>
        )}

        {/* Problem vs Solution Case Study */}
        {(project.problem || project.solution) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}
            className="case-study-grid"
          >
            {project.problem && (
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--red-light)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}
                >
                  The Challenge:
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(52, 211, 153, 0.3)'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--emerald-light)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}
                >
                  The Engineering Solution:
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {project.solution}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Architectural Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Key Engineering Capabilities
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {project.highlights.map((h, i) => (
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
                  <span style={{ color: 'var(--cyan)', marginTop: '0.15rem', flexShrink: 0 }}>
                    ✦
                  </span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {project.tech && project.tech.length > 0 && (
          <div style={{ marginBottom: '2.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              Technologies & Frameworks
            </h3>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="tech-tag"
                  style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Links */}
        <div
          style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}
          className="project-modal-ctas"
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <GithubIcon size={16} />
              <span>Source Repository</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <span>Live Application</span>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .case-study-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .project-modal-ctas .btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </dialog>
  );
}
