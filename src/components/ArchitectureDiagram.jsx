import React from 'react';
import { ArrowRight, Cpu, Database, Server, Sparkles, Layers } from 'lucide-react';

export default function ArchitectureDiagram({ nodes = [] }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: 'rgba(0, 0, 0, 0.35)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <Layers size={14} color="var(--cyan)" />
        <span>End-to-End System Pipeline & Data Flow</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="architecture-scroll-row">
        {nodes.map((node, idx) => (
          <React.Fragment key={idx}>
            <div
              style={{
                flexShrink: 0,
                background: 'rgba(15, 22, 36, 0.85)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                minWidth: '130px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyan)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
            >
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: '0.2rem' }}>
                STAGE 0{idx + 1}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {node}
              </div>
            </div>

            {idx < nodes.length - 1 && (
              <div style={{ color: 'var(--cyan)', opacity: 0.6, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <ArrowRight size={16} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
