import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  Layers, 
  Cpu, 
  Brain, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Terminal, 
  Activity,
  Crosshair,
  Volume2
} from 'lucide-react';
import { useCyberSound } from '../hooks/useCyberSound';

export default function InteractivePortrait() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
  
  // Modes: 'off' | 'biometric' | 'embeddings' | 'telemetry'
  const [hudMode, setHudMode] = useState('biometric');
  const [liveConfidence, setLiveConfidence] = useState(99.8);
  const [tensorSample, setTensorSample] = useState(['+0.842', '-0.198', '+0.712', '+0.450']);
  
  const { playBeep, playLaser, playSuccess } = useCyberSound();

  // Dynamic live tensor vector updates
  useEffect(() => {
    if (hudMode === 'off') return;
    const interval = setInterval(() => {
      setLiveConfidence((99.6 + Math.random() * 0.35).toFixed(1));
      setTensorSample([
        (Math.random() * 2 - 1).toFixed(3),
        (Math.random() * 2 - 1).toFixed(3),
        (Math.random() * 2 - 1).toFixed(3),
        (Math.random() * 2 - 1).toFixed(3)
      ]);
    }, 1800);
    return () => clearInterval(interval);
  }, [hudMode]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, opacity: 1 });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
    setTilt({ x: 0, y: 0 });
  };

  const cycleHudMode = (e) => {
    e.stopPropagation();
    const modes = ['biometric', 'embeddings', 'telemetry', 'off'];
    const next = modes[(modes.indexOf(hudMode) + 1) % modes.length];
    setHudMode(next);
    if (next === 'biometric') playLaser();
    else if (next === 'off') playBeep(440);
    else playSuccess();
  };

  // Facial Landmark Points for Biometric Mesh
  const landmarkPoints = [
    { x: '35%', y: '33%', label: 'L_EYE' },
    { x: '58%', y: '34%', label: 'R_EYE' },
    { x: '45%', y: '43%', label: 'NOSE_TIP' },
    { x: '42%', y: '52%', label: 'MOUTH_L' },
    { x: '54%', y: '53%', label: 'MOUTH_R' },
    { x: '28%', y: '42%', label: 'CHEEK_L' },
    { x: '68%', y: '44%', label: 'CHEEK_R' },
    { x: '46%', y: '64%', label: 'CHIN' }
  ];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="portrait-card-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '450px',
        marginInline: 'auto',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={cycleHudMode}
    >
      {/* Outer Holographic Glow Aurora */}
      <div
        style={{
          position: 'absolute',
          inset: '-8px',
          background: 'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 45%, #10b981 100%)',
          borderRadius: '26px',
          filter: 'blur(18px)',
          opacity: hudMode !== 'off' ? 0.35 : 0.15,
          zIndex: 0,
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* Main Glassmorphic Photo Container */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '22px',
          overflow: 'hidden',
          border: '1.5px solid var(--border-accent)',
          background: 'var(--bg-surface-elevated)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Dynamic Light Reflection Glare Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            opacity: mousePos.opacity,
            transition: 'opacity 0.25s ease',
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.24), transparent 70%)`,
            zIndex: 5
          }}
        />

        {/* High-Resolution Portrait Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
          <img
            src="/Tanvir.png"
            alt="Tanvir Ahmed - AI/ML Engineer & Researcher"
            fetchPriority="high"
            loading="eager"
            width="450"
            height="450"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: hudMode === 'embeddings' ? 'hue-rotate(25deg) contrast(1.1)' : 'none'
            }}
          />

          {/* MODE 1: BIOMETRIC COMPUTER VISION HUD */}
          {hudMode === 'biometric' && (
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
                <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '14px', height: '14px', borderTop: '3px solid var(--cyan)', borderLeft: '3px solid var(--cyan)' }} />
                <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', borderTop: '3px solid var(--cyan)', borderRight: '3px solid var(--cyan)' }} />
                <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '14px', height: '14px', borderBottom: '3px solid var(--cyan)', borderLeft: '3px solid var(--cyan)' }} />
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '14px', height: '14px', borderBottom: '3px solid var(--cyan)', borderRight: '3px solid var(--cyan)' }} />

                {/* Top Confidence Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-26px',
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
              {landmarkPoints.map((pt, i) => (
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
                    background: '#34d399',
                    boxShadow: '0 0 8px #34d399',
                    animation: 'pulseDot 1.5s infinite ease-in-out'
                  }}
                />
              ))}
            </div>
          )}

          {/* MODE 2: NEURAL EMBEDDINGS HEATMAP & TENSOR STREAM */}
          {hudMode === 'embeddings' && (
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
                <div style={{ color: '#818cf8', fontWeight: 700, marginBottom: '0.2rem' }}>[768-D VECTOR STATE]</div>
                {tensorSample.map((val, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
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
                  color: '#34d399'
                }}
              >
                <div>COSINE SIM: 0.998</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>INDEX: HNSW (M=16)</div>
              </div>
            </div>
          )}

          {/* MODE 3: PRODUCTION TELEMETRY OVERLAY */}
          {hudMode === 'telemetry' && (
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
                <div style={{ background: 'rgba(8, 10, 15, 0.85)', padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                  <div style={{ color: 'var(--text-dim)' }}>ETL SPEEDUP</div>
                  <div style={{ color: 'var(--cyan)', fontWeight: 700 }}>32x PARALLEL</div>
                </div>
                <div style={{ background: 'rgba(8, 10, 15, 0.85)', padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                  <div style={{ color: 'var(--text-dim)' }}>CNN ACCURACY</div>
                  <div style={{ color: '#34d399', fontWeight: 700 }}>97%+ ON 20K IMAGES</div>
                </div>
                <div style={{ background: 'rgba(8, 10, 15, 0.85)', padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                  <div style={{ color: 'var(--text-dim)' }}>RAG LATENCY</div>
                  <div style={{ color: '#818cf8', fontWeight: 700 }}>&lt;45ms P99</div>
                </div>
                <div style={{ background: 'rgba(8, 10, 15, 0.85)', padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                  <div style={{ color: 'var(--text-dim)' }}>FRAUD RATE</div>
                  <div style={{ color: '#f59e0b', fontWeight: 700 }}>0.001 FLR</div>
                </div>
              </div>
            </div>
          )}

          {/* Gradient Ambient Vignette at Bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '42%',
              background: 'linear-gradient(to top, rgba(8, 10, 15, 0.95) 0%, rgba(8, 10, 15, 0.45) 55%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />

          {/* Top Left: Live Status Pill */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              zIndex: 4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(8, 10, 15, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} />
            <span>AI Engineer @ upay</span>
          </div>

          {/* Top Right: Interactive Multi-Mode HUD Selector */}
          <button
            type="button"
            onClick={cycleHudMode}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              zIndex: 4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.7rem',
              borderRadius: 'var(--radius-full)',
              background: hudMode !== 'off' ? 'var(--cyan)' : 'rgba(8, 10, 15, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: hudMode !== 'off' ? 'var(--btn-text-color)' : '#ffffff',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transition: 'all 0.2s ease'
            }}
            title="Click to cycle HUD modes: Biometric -> Vectors -> Telemetry -> Off"
          >
            <Scan size={12} />
            <span>HUD: {hudMode.toUpperCase()}</span>
          </button>

          {/* Bottom Card Summary Info */}
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              right: '14px',
              zIndex: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <div>
              <div style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                Tanvir Ahmed
              </div>
              <div style={{ color: 'var(--cyan)', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                Multilingual RAG • Computer Vision • FinTech
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid var(--border-accent)',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 700
              }}
            >
              <Zap size={11} />
              <span>UCB Fintech</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes laserScan {
          0%, 100% { top: 0%; opacity: 0.9; }
          50% { top: 96%; opacity: 0.9; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .portrait-card-wrapper:hover img {
          transform: scale(1.025);
        }
      `}</style>
    </div>
  );
}
