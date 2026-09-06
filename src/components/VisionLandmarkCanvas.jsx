import React, { useRef, useEffect, useState } from 'react';
import { Hand } from 'lucide-react';

// 21 Landmark Hand Skeleton Connections (MediaPipe Standard)
const CONNECTIONS = [
  // Thumb
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  // Index
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  // Middle
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  // Ring
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  // Pinky
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  // Palm base
  [5, 9],
  [9, 13],
  [13, 17]
];

export default function VisionLandmarkCanvas() {
  const canvasRef = useRef(null);
  const [isPinching, setIsPinching] = useState(false);
  const [handPos, setHandPos] = useState({ x: 220, y: 160 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Generate 21 landmarks based on hand position and pinch state
      const cx = handPos.x;
      const cy = handPos.y;
      const scale = Math.min(w, h) * 0.38;

      // Base Palm (0)
      const landmarks = [];
      landmarks[0] = { x: cx, y: cy + scale * 0.65 };

      // Thumb (1..4)
      const thumbPinchOffset = isPinching ? 0.3 : 1.0;
      landmarks[1] = { x: cx - scale * 0.28, y: cy + scale * 0.45 };
      landmarks[2] = { x: cx - scale * 0.45, y: cy + scale * 0.25 };
      landmarks[3] = { x: cx - scale * 0.38 * thumbPinchOffset, y: cy + scale * 0.05 };
      landmarks[4] = {
        x: cx - scale * 0.15 * thumbPinchOffset,
        y: cy - scale * 0.05 * (isPinching ? -0.8 : 1)
      };

      // Index (5..8)
      const indexPinchOffset = isPinching ? 0.2 : 1.0;
      landmarks[5] = { x: cx - scale * 0.18, y: cy + scale * 0.15 };
      landmarks[6] = { x: cx - scale * 0.18 * indexPinchOffset, y: cy - scale * 0.15 };
      landmarks[7] = { x: cx - scale * 0.16 * indexPinchOffset, y: cy - scale * 0.38 };
      landmarks[8] = {
        x: cx - scale * 0.14 * indexPinchOffset,
        y: cy - scale * 0.58 * (isPinching ? 0.4 : 1)
      };

      // Middle (9..12)
      landmarks[9] = { x: cx + scale * 0.02, y: cy + scale * 0.12 };
      landmarks[10] = { x: cx + scale * 0.02, y: cy - scale * 0.2 };
      landmarks[11] = { x: cx + scale * 0.02, y: cy - scale * 0.46 };
      landmarks[12] = { x: cx + scale * 0.02, y: cy - scale * 0.68 };

      // Ring (13..16)
      landmarks[13] = { x: cx + scale * 0.2, y: cy + scale * 0.16 };
      landmarks[14] = { x: cx + scale * 0.22, y: cy - scale * 0.14 };
      landmarks[15] = { x: cx + scale * 0.23, y: cy - scale * 0.36 };
      landmarks[16] = { x: cx + scale * 0.24, y: cy - scale * 0.54 };

      // Pinky (17..20)
      landmarks[17] = { x: cx + scale * 0.36, y: cy + scale * 0.24 };
      landmarks[18] = { x: cx + scale * 0.42, y: cy - scale * 0.02 };
      landmarks[19] = { x: cx + scale * 0.45, y: cy - scale * 0.22 };
      landmarks[20] = { x: cx + scale * 0.48, y: cy - scale * 0.38 };

      // Draw Skeleton Bones
      ctx.lineWidth = 2.5;
      for (const [i, j] of CONNECTIONS) {
        ctx.strokeStyle = isPinching ? 'rgba(52, 211, 153, 0.7)' : 'rgba(56, 189, 248, 0.65)';
        ctx.beginPath();
        ctx.moveTo(landmarks[i].x, landmarks[i].y);
        ctx.lineTo(landmarks[j].x, landmarks[j].y);
        ctx.stroke();
      }

      // Draw Keypoint Nodes
      for (let i = 0; i < landmarks.length; i++) {
        const pt = landmarks[i];
        const isTip = [4, 8, 12, 16, 20].includes(i);
        const radius = isTip ? 5.5 : 3.5;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);

        if (isTip) {
          ctx.fillStyle = i === 8 || i === 4 ? (isPinching ? '#10b981' : '#38bdf8') : '#818cf8';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Pinch Distance Visual Indicator
      if (landmarks[4] && landmarks[8]) {
        ctx.strokeStyle = isPinching ? '#10b981' : 'rgba(244, 63, 94, 0.6)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(landmarks[4].x, landmarks[4].y);
        ctx.lineTo(landmarks[8].x, landmarks[8].y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [handPos, isPinching]);

  const updatePosition = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.max(0, Math.min(canvas.width, (clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(canvas.height, (clientY - rect.top) * scaleY));
    setHandPos({ x, y });
  };

  const handleMouseMove = (e) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <Hand size={16} color="var(--cyan)" />
            <span>MediaPipe 21-Landmark Hand Tracker Demo</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Move cursor or drag on screen to steer hand. Click/tap and hold to simulate Pinch-Click
            action.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: isPinching ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.1)',
              border: `1px solid ${isPinching ? '#10b981' : 'var(--cyan)'}`,
              color: isPinching ? 'var(--emerald-light)' : 'var(--cyan)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {isPinching ? 'TRIGGER: PINCH CLICK (MOUSE DOWN)' : 'GESTURE: TRACKING'}
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-medium)',
          overflow: 'hidden',
          cursor: 'crosshair',
          touchAction: 'none'
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={(e) => {
          setIsPinching(true);
          handleTouchMove(e);
        }}
        onTouchEnd={() => setIsPinching(false)}
        onMouseDown={() => setIsPinching(true)}
        onMouseUp={() => setIsPinching(false)}
        onMouseLeave={() => setIsPinching(false)}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            pointerEvents: 'none',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span>
            FPS: <strong style={{ color: 'var(--emerald-light)' }}>60.0</strong>
          </span>
          <span>
            Joints: <strong style={{ color: 'var(--cyan)' }}>21 3D Nodes</strong>
          </span>
          <span>
            Smoothing: <strong style={{ color: 'var(--violet)' }}>EMA Filter</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
