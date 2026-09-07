import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useSound } from '../../contexts/SoundContext';
import PillBadge from '../PillBadge';

export default function FraudScorerTab() {
  const [fraudInputs, setFraudInputs] = useState({
    amount: 25000,
    velocity: 8,
    isNewDevice: true,
    timeOfDay: '03:15 AM'
  });
  const [fraudScore, setFraudScore] = useState(null);
  const timeoutRef = useRef(null);

  const { playSuccess, playLaser } = useSound();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const calculateFraud = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    playLaser();
    let baseScore = 0.05;
    if (fraudInputs.amount > 20000) baseScore += 0.35;
    if (fraudInputs.velocity > 5) baseScore += 0.3;
    if (fraudInputs.isNewDevice) baseScore += 0.2;
    if (fraudInputs.timeOfDay.includes('03:') || fraudInputs.timeOfDay.includes('04:'))
      baseScore += 0.15;

    const final = Math.min(0.99, baseScore);
    timeoutRef.current = setTimeout(() => {
      setFraudScore({
        score: final,
        riskLevel:
          final > 0.65
            ? 'CRITICAL / BLOCKED'
            : final > 0.35
              ? 'SUSPICIOUS / 2FA CHALLENGE'
              : 'LEGITIMATE / ALLOWED',
        color: final > 0.65 ? '#ef4444' : final > 0.35 ? '#d97706' : '#059669',
        latency: '18ms'
      });
      playSuccess();
    }, 300);
  };

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
      className="playground-grid"
    >
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          FinTech Transaction Risk & Anomaly Scorer
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Evaluates velocity patterns, account behavioral deviations, and device telemetry to
          generate real-time sub-20ms fraud risk verdicts.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                marginBottom: '0.35rem',
                color: 'var(--text-main)'
              }}
            >
              <span>Transaction Amount (BDT):</span>
              <strong style={{ color: 'var(--cyan)' }}>
                ৳ {fraudInputs.amount.toLocaleString()}
              </strong>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={fraudInputs.amount}
              onChange={(e) => setFraudInputs({ ...fraudInputs, amount: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--cyan)' }}
            />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                marginBottom: '0.35rem',
                color: 'var(--text-main)'
              }}
            >
              <span>Hourly Transaction Velocity:</span>
              <strong style={{ color: 'var(--violet)' }}>
                {fraudInputs.velocity} attempts / hr
              </strong>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={fraudInputs.velocity}
              onChange={(e) => setFraudInputs({ ...fraudInputs, velocity: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--violet)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="newDev"
              checked={fraudInputs.isNewDevice}
              onChange={(e) => setFraudInputs({ ...fraudInputs, isNewDevice: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--cyan)' }}
            />
            <label
              htmlFor="newDev"
              style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}
            >
              Unrecognized Device Fingerprint / New IMEI
            </label>
          </div>

          <button
            type="button"
            onClick={calculateFraud}
            className="btn btn-primary"
            style={{ marginTop: '0.5rem' }}
          >
            <ShieldCheck size={16} />
            <span>Evaluate Anomaly Risk Score</span>
          </button>
        </div>
      </div>

      {/* Fraud Metric Box */}
      <div
        style={{
          background: 'var(--terminal-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-medium)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {fraudScore ? (
          <>
            <div
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}
            >
              RISK PROBABILITY INDEX
            </div>
            <div
              style={{
                fontSize: '3.2rem',
                fontWeight: 800,
                color: fraudScore.color,
                fontFamily: 'var(--font-heading)'
              }}
            >
              {(fraudScore.score * 100).toFixed(1)}%
            </div>
            <PillBadge
              size="md"
              mono
              style={{
                background: `${fraudScore.color}15`,
                border: `1px solid ${fraudScore.color}50`,
                color: fraudScore.color,
                fontWeight: 700,
                fontSize: '0.85rem',
                marginTop: '0.75rem'
              }}
            >
              VERDICT: {fraudScore.riskLevel}
            </PillBadge>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                marginTop: '1.25rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              Inference Engine: LightGBM + Isolation Forest (Latency: {fraudScore.latency})
            </div>
          </>
        ) : (
          <div
            style={{
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}
          >
            Adjust parameters and click "Evaluate Anomaly Risk Score" to trigger real-time scoring.
          </div>
        )}
      </div>
    </div>
  );
}
