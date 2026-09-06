import React from 'react';

export default function EmbeddingsHud({ tensorSample }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at center, rgba(129, 140, 248, 0.15), transparent 70%)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '12px',
          background: 'rgba(8, 10, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '0.4rem 0.65rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.66rem',
          color: 'var(--cyan)'
        }}
      >
        <div style={{ color: '#818cf8', fontWeight: 700, marginBottom: '0.2rem' }}>
          [768-D VECTOR STATE]
        </div>
        {tensorSample.map((val, idx) => (
          <div
            key={idx}
            style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
          >
            <span style={{ color: 'var(--text-dim)' }}>w_{idx}:</span>
            <span>{val}</span>
          </div>
        ))}
      </div>

      {/* Qdrant Cosine Distance Pill */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          right: '12px',
          background: 'rgba(8, 10, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '6px',
          padding: '0.35rem 0.6rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.66rem',
          color: 'var(--emerald-light)'
        }}
      >
        <div>COSINE SIM: 0.998</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>INDEX: HNSW (M=16)</div>
      </div>
    </div>
  );
}
