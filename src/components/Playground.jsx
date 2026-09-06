import React, { useState } from 'react';
import { Sparkles, Languages, Search, Hand, Rotate3d, ShieldCheck } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import VectorSpaceTab from './playground/VectorSpaceTab';
import RagEngineTab from './playground/RagEngineTab';
import DialectClassifierTab from './playground/DialectClassifierTab';
import FraudScorerTab from './playground/FraudScorerTab';
import VisionTrackerTab from './playground/VisionTrackerTab';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';

const TABS = [
  { id: '3dvector', label: '3D Vector Space', Icon: Rotate3d },
  { id: 'rag', label: 'Multilingual RAG Engine', Icon: Search },
  { id: 'dialect', label: 'Bangla Dialect Classifier', Icon: Languages },
  { id: 'fraud', label: 'FinTech Anomaly Scorer', Icon: ShieldCheck },
  { id: 'vision', label: 'CV Landmark Tracker', Icon: Hand }
];

export default function Playground({ activeTab: controlledTab, onTabChange }) {
  const [localActiveTab, setLocalActiveTab] = useState('3dvector');
  const activeTab = controlledTab !== undefined ? controlledTab : localActiveTab;
  const { playBeep } = useSound();

  const handleSelectTab = (id) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setLocalActiveTab(id);
    }
  };

  // Tabs use a roving tabindex, so Left/Right (plus Home/End) have to move
  // the selection — otherwise only the active tab is keyboard reachable.
  const handleTabKeyDown = (e) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const current = TABS.findIndex((t) => t.id === activeTab);
    let next = current >= 0 ? current : 0;
    if (e.key === 'ArrowRight') next = (next + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (next - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TABS.length - 1;

    handleSelectTab(TABS[next].id);
    playBeep(600);
    document.getElementById(`playground-tab-${TABS[next].id}`)?.focus();
  };

  return (
    <section id="playground" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <Sparkles size={13} />
            <ScrambleText text="Interactive Simulator" />
          </div>
          <h2 className="section-title">
            Live AI / ML <span className="gradient-text">Playground</span>
          </h2>
          <p className="section-subtitle">
            Experience real-time interactive simulations of my 3D Vector Space, Multilingual RAG,
            Dialect Transformer, FinTech Risk Engine, and MediaPipe Hand Tracking algorithms right
            in your browser.
          </p>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              marginTop: '0.4rem'
            }}
          >
            Note: the RAG, Dialect, and Fraud tabs run client-side simulated demos with illustrative
            sample data — not live model inference.
          </p>
        </Reveal>

        <div
          className="glass-card"
          style={{
            padding: 'clamp(1.25rem, 3vw, 2.5rem)',
            border: '1px solid var(--border-medium)'
          }}
        >
          {/* Tabs header with horizontal scroll on mobile */}
          <div
            role="tablist"
            aria-label="AI/ML playground demos"
            onKeyDown={handleTabKeyDown}
            style={{
              display: 'flex',
              gap: '0.6rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1.25rem',
              marginBottom: '2rem',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}
          >
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`playground-tab-${id}`}
                aria-controls={`playground-panel-${id}`}
                aria-selected={activeTab === id}
                tabIndex={activeTab === id ? 0 : -1}
                onClick={() => {
                  handleSelectTab(id);
                  playBeep(600);
                }}
                className={`btn btn-sm ${activeTab === id ? 'btn-primary' : 'btn-outline'}`}
                style={{ flexShrink: 0 }}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`playground-panel-${activeTab}`}
            aria-labelledby={`playground-tab-${activeTab}`}
            tabIndex={0}
          >
            {activeTab === '3dvector' && <VectorSpaceTab />}
            {activeTab === 'rag' && <RagEngineTab />}
            {activeTab === 'dialect' && <DialectClassifierTab />}
            {activeTab === 'fraud' && <FraudScorerTab />}
            {activeTab === 'vision' && <VisionTrackerTab />}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .playground-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
      `}</style>
    </section>
  );
}
