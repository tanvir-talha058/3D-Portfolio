import React from 'react';

const METRICS = [
  { label: 'ETL SPEEDUP', value: '32x PARALLEL', color: 'var(--cyan)' },
  { label: 'CNN ACCURACY', value: '97%+ ON 20K IMAGES', color: 'var(--emerald-light)' },
  { label: 'RAG LATENCY', value: '<45ms P99', color: '#818cf8' },
  { label: 'FRAUD RATE', value: '0.001 FLR', color: '#f59e0b' }
];

export default function TelemetryHud() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '14px',
          right: '14px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.45rem'
        }}
      >
        {METRICS.map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: 'rgba(8, 10, 15, 0.85)',
              padding: '0.35rem 0.55rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem'
            }}
          >
            <div style={{ color: 'var(--text-dim)' }}>{label}</div>
            <div style={{ color, fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
