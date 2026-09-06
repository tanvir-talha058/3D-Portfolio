import React from 'react';
import { Crosshair } from 'lucide-react';

const LANDMARK_POINTS = [
  { x: '35%', y: '33%', label: 'L_EYE' },
  { x: '58%', y: '34%', label: 'R_EYE' },
  { x: '45%', y: '43%', label: 'NOSE_TIP' },
  { x: '42%', y: '52%', label: 'MOUTH_L' },
  { x: '54%', y: '53%', label: 'MOUTH_R' },
  { x: '28%', y: '42%', label: 'CHEEK_L' },
  { x: '68%', y: '44%', label: 'CHEEK_R' },
  { x: '46%', y: '64%', label: 'CHIN' }
];

export default function BiometricHud({ liveConfidence }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
      {/* Facial Bounding Box */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '18%',
          width: '64%',
          height: '66%',
          border: '1.5px dashed var(--cyan)',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
          animation: 'pulseGlow 2.5s infinite ease-in-out'
        }}
      >
        {/* Tech Bracket Corners */}
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            width: '14px',
            height: '14px',
            borderTop: '3px solid var(--cyan)',
            borderLeft: '3px solid var(--cyan)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '14px',
            height: '14px',
            borderTop: '3px solid var(--cyan)',
            borderRight: '3px solid var(--cyan)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            left: '-4px',
            width: '14px',
            height: '14px',
            borderBottom: '3px solid var(--cyan)',
            borderLeft: '3px solid var(--cyan)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '14px',
            height: '14px',
            borderBottom: '3px solid var(--cyan)',
            borderRight: '3px solid var(--cyan)'
          }}
        />

        {/* Top Confidence Pill */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '0',
            background: 'var(--cyan)',
            color: 'var(--btn-text-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Crosshair size={11} />
          <span>FACE_EMBED_V3 • {liveConfidence}% CONF</span>
        </div>

        {/* Laser Scan Line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
            boxShadow: '0 0 12px var(--cyan)',
            animation: 'laserScan 2.2s infinite ease-in-out'
          }}
        />
      </div>

      {/* Facial Landmark Tracking Points */}
      {LANDMARK_POINTS.map((pt, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: pt.x,
            top: pt.y,
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--emerald-light)',
            boxShadow: '0 0 8px var(--emerald-light)',
            animation: 'pulseDot 1.5s infinite ease-in-out'
          }}
        />
      ))}
    </div>
  );
}
