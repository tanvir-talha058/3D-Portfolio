import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

export default function ArchitectureDiagram({ nodes = [] }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div
      style={{
        margin: '1.5rem 0',
        padding: '1.25rem',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div
        style={{
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem'
        }}
      >
        <Layers size={14} color="var(--cyan)" />
        <span>End-to-End System Pipeline & Data Flow</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          overflowX: 'auto',
          paddingBottom: '0.65rem',
          paddingInline: '0.5rem'
        }}
        className="architecture-scroll-row"
      >
        {nodes.map((node, idx) => (
          <React.Fragment key={idx}>
            <div
              className="pipeline-stage"
              style={{
                flexShrink: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                minWidth: '115px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                animationDelay: `${idx * 0.09}s`,
                // Angled away from the viewer, each stage a little further
                // back than the last, so the row reads as a receding pipeline.
                '--stage-rot': '-20deg',
                '--stage-z': `${idx * -10}px`
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--cyan)',
                  marginBottom: '0.2rem'
                }}
              >
                STAGE 0{idx + 1}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {node}
              </div>
            </div>

            {idx < nodes.length - 1 && (
              <div
                className="pipeline-arrow"
                style={{
                  color: 'var(--cyan)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  animationDelay: `${idx * 0.22}s`
                }}
              >
                <ArrowRight size={15} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        .architecture-scroll-row::-webkit-scrollbar {
          height: 5px;
        }
        .architecture-scroll-row::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
        }
        .architecture-scroll-row::-webkit-scrollbar-thumb {
          background: var(--border-medium);
          border-radius: 4px;
        }
        .architecture-scroll-row::-webkit-scrollbar-thumb:hover {
          background: var(--cyan);
        }
      `}</style>
    </div>
  );
}
