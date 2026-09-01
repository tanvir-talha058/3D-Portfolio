import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Send, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Code2, 
  CheckCircle,
  Play,
  RotateCcw,
  Languages,
  Search,
  Sliders,
  Mic,
  MicOff,
  Eye,
  Hand,
  Rotate3d,
  Zap,
  Activity
} from 'lucide-react';
import VisionLandmarkCanvas from './VisionLandmarkCanvas';
import VectorSpace3D from './VectorSpace3D';
import { useCyberSound } from '../hooks/useCyberSound';

export default function Playground() {
  const [activeTab, setActiveTab] = useState('3dvector');
  const [ragQuery, setRagQuery] = useState('How does upay handle transaction validation?');
  const [ragResult, setRagResult] = useState(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamedTokens, setStreamedTokens] = useState('');
  const [tokenStats, setTokenStats] = useState({ ttft: 0, tps: 0, count: 0 });

  // Dialect Playground State
  const [dialectText, setDialectText] = useState('মুই তোরে ভালোবাসুম, তুই কুন্ঠে যাস?');
  const [dialectResult, setDialectResult] = useState(null);
  const [isLoadingDialect, setIsLoadingDialect] = useState(false);

  // Fraud Playground State
  const [fraudInputs, setFraudInputs] = useState({
    amount: 25000,
    velocity: 8,
    isNewDevice: true,
    timeOfDay: '03:15 AM'
  });
  const [fraudScore, setFraudScore] = useState(null);

  const { playBeep, playSuccess, playLaser } = useCyberSound();

  // Web Speech API Voice Recognition (STT)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition API is not supported in this browser. Please try Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      playBeep(880, 'sine', 0.05);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRagQuery(transcript);
      setIsListening(false);
      playSuccess();
      setTimeout(() => simulateRag(transcript), 200);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const simulateRag = (overrideQuery) => {
    const q = overrideQuery || ragQuery;
    setIsLoadingRag(true);
    setStreamedTokens('');
    playLaser();

    const fullAnswer = "upay's transaction validation pipeline processes inbound requests through a sub-50ms dual pipeline: fast deterministic ISO8583 rule checks and real-time ML risk inference evaluated against behavioral velocity vectors in Qdrant.";

    setTimeout(() => {
      setRagResult({
        query: q,
        language: q.includes('মুই') || q.includes('কীভাবে') ? 'Bangla / Multilingual' : 'English / Banglish',
        retrievedDocs: [
          {
            score: 0.94,
            title: "upay API Transaction Lifecycle & ISO8583 Gateway",
            snippet: "Incoming payments undergo dual-pass cryptographic validation followed by ML velocity anomaly checks before settlement ledger commit."
          },
          {
            score: 0.88,
            title: "Qdrant Hybrid Vector Store Architecture",
            snippet: "Embeddings generated via fine-tuned multilingual SentenceTransformers with cosine similarity reranking via CrossEncoder."
          }
        ],
        generatedAnswer: fullAnswer,
        latencyMs: 38
      });

      // Stream Tokens dynamically
      const words = fullAnswer.split(' ');
      let currentIdx = 0;
      let buffer = '';
      const startTime = performance.now();

      const streamTimer = setInterval(() => {
        if (currentIdx < words.length) {
          buffer += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
          setStreamedTokens(buffer);
          currentIdx++;
          const elapsed = (performance.now() - startTime) / 1000;
          setTokenStats({
            ttft: 28,
            tps: Math.round(currentIdx / (elapsed || 0.1)),
            count: currentIdx
          });
        } else {
          clearInterval(streamTimer);
          setIsLoadingRag(false);
          playSuccess();
        }
      }, 25);
    }, 450);
  };

  const simulateDialect = () => {
    setIsLoadingDialect(true);
    playLaser();
    setTimeout(() => {
      setDialectResult({
        detectedRegion: "Rangpur / North Bengal (রংপুর অঞ্চল)",
        confidence: 0.964,
        standardBengali: "আমি তোমাকে ভালোবাসি, তুমি কোথায় যাচ্ছ?",
        tokenFeatures: ["মুই (1st person pronoun)", "ভালোবাসুম (Regional verb)", "কুন্ঠে (Locative interrogative)"],
        model: "Bangla Dialect Transformer (20,090 corpus)"
      });
      setIsLoadingDialect(false);
      playSuccess();
    }, 500);
  };

  const calculateFraud = () => {
    playLaser();
    let baseScore = 0.05;
    if (fraudInputs.amount > 20000) baseScore += 0.35;
    if (fraudInputs.velocity > 5) baseScore += 0.30;
    if (fraudInputs.isNewDevice) baseScore += 0.20;
    if (fraudInputs.timeOfDay.includes('03:') || fraudInputs.timeOfDay.includes('04:')) baseScore += 0.15;

    const final = Math.min(0.99, baseScore);
    setTimeout(() => {
      setFraudScore({
        score: final,
        riskLevel: final > 0.65 ? 'CRITICAL / BLOCKED' : final > 0.35 ? 'SUSPICIOUS / 2FA CHALLENGE' : 'LEGITIMATE / ALLOWED',
        color: final > 0.65 ? '#ef4444' : final > 0.35 ? '#d97706' : '#059669',
        latency: '18ms'
      });
      playSuccess();
    }, 300);
  };

  return (
    <section id="playground" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={13} />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="section-title">
            Live AI / ML <span className="gradient-text">Playground</span>
          </h2>
          <p className="section-subtitle">
            Experience real-time interactive simulations of my 3D Vector Space, Multilingual RAG, Dialect Transformer, FinTech Risk Engine, and MediaPipe Hand Tracking algorithms right in your browser.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem)', border: '1px solid var(--border-medium)' }}>
          {/* Tabs header with horizontal scroll on mobile */}
          <div 
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
            <button
              type="button"
              onClick={() => { setActiveTab('3dvector'); playBeep(600); }}
              className={`btn btn-sm ${activeTab === '3dvector' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flexShrink: 0 }}
            >
              <Rotate3d size={14} />
              <span>3D Vector Space</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('rag'); playBeep(600); }}
              className={`btn btn-sm ${activeTab === 'rag' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flexShrink: 0 }}
            >
              <Search size={14} />
              <span>Multilingual RAG Engine</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('dialect'); playBeep(600); }}
              className={`btn btn-sm ${activeTab === 'dialect' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flexShrink: 0 }}
            >
              <Languages size={14} />
              <span>Bangla Dialect Classifier</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('fraud'); playBeep(600); }}
              className={`btn btn-sm ${activeTab === 'fraud' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flexShrink: 0 }}
            >
              <ShieldCheck size={14} />
              <span>FinTech Anomaly Scorer</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('vision'); playBeep(600); }}
              className={`btn btn-sm ${activeTab === 'vision' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flexShrink: 0 }}
            >
              <Hand size={14} />
              <span>CV Landmark Tracker</span>
            </button>
          </div>

          {/* TAB 0: 3D Vector Space */}
          {activeTab === '3dvector' && (
            <div>
              <VectorSpace3D />
            </div>
          )}

          {/* TAB 1: RAG Engine */}
          {activeTab === 'rag' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="playground-grid">
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  Hybrid Vector Search & Query Synthesis
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Simulates a dual-pass sparse (BM25) + dense (Qdrant) retrieval pipeline over multilingual banking knowledge bases.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <label style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    ENTER INQUIRY (English / Bangla / Banglish):
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      placeholder="e.g. upay remittance charge koto?"
                      style={{
                        flex: '1 1 240px',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem 1rem',
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                    
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className="btn btn-outline"
                      style={{
                        borderColor: isListening ? '#ef4444' : 'var(--border-medium)',
                        color: isListening ? '#ef4444' : 'var(--text-main)',
                        background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                      }}
                      title="Speak using Web Speech API"
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      <span>{isListening ? 'Listening...' : 'Voice'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => simulateRag()}
                      disabled={isLoadingRag}
                      className="btn btn-primary"
                    >
                      {isLoadingRag ? <RotateCcw size={15} className="spin" /> : <Play size={15} />}
                      <span>Execute RAG</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Try presets:</span>
                    <button
                      type="button"
                      onClick={() => { setRagQuery('upay merchant payment API integration steps?'); simulateRag('upay merchant payment API integration steps?'); }}
                      className="tech-tag"
                      style={{ cursor: 'pointer' }}
                    >
                      Merchant API
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRagQuery('bKash to upay fund transfer limits'); simulateRag('bKash to upay fund transfer limits'); }}
                      className="tech-tag"
                      style={{ cursor: 'pointer' }}
                    >
                      Transfer Limits
                    </button>
                  </div>
                </div>
              </div>

              {/* RAG Telemetry Output */}
              <div
                style={{
                  background: 'var(--terminal-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  padding: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                  <span>SYNTHESIZER_PIPELINE.LOG</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>200 OK</span>
                </div>

                {ragResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--cyan)' }}>&gt; Inferred Language:</span>{' '}
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{ragResult.language}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--violet)' }}>&gt; Dense Vector Hits:</span>
                      <div style={{ marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {ragResult.retrievedDocs.map((doc, idx) => (
                          <div key={idx} style={{ background: 'var(--terminal-row-bg)', padding: '0.5rem 0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--cyan)' }}>
                            <div style={{ color: 'var(--cyan)', fontSize: '0.78rem', fontWeight: 600 }}>{doc.title} (Relevance: {doc.score})</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{doc.snippet}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#059669', fontWeight: 600 }}>&gt; Streaming Token Synthesis:</span>
                        {isLoadingRag && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', animation: 'pulseDot 1s infinite' }}>
                            ● STREAMING ({tokenStats.tps} tok/s)
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: 1.55, fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                        {streamedTokens || ragResult.generatedAnswer}
                        {isLoadingRag && <span style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--cyan)', marginLeft: '4px', verticalAlign: 'middle', animation: 'blinkCursor 0.5s infinite' }} />}
                      </p>
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span>TTFT: <strong style={{ color: 'var(--cyan)' }}>{tokenStats.ttft || 28}ms</strong> • Speed: <strong style={{ color: '#059669' }}>{tokenStats.tps || 135} tok/s</strong></span>
                      <span>Index: Qdrant-v1.8-Bangla</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-dim)', padding: '2rem 0', textAlign: 'center' }}>
                    Enter a query and click "Execute RAG" to inspect retrieval tokens & streaming synthesis.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Dialect Classifier */}
          {activeTab === 'dialect' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="playground-grid">
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  Bangla Regional Dialect Transformer
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Classifies regional dialects across 8 major districts of Bangladesh using fine-tuned m-BERT & RoBERTa representations trained on 20,090 curated dialectal samples.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <label style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    ENTER REGIONAL BANGLA TEXT:
                  </label>
                  <textarea
                    rows="3"
                    value={dialectText}
                    onChange={(e) => setDialectText(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      color: 'var(--text-main)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      resize: 'none',
                      outline: 'none'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={simulateDialect}
                      disabled={isLoadingDialect}
                      className="btn btn-primary"
                    >
                      {isLoadingDialect ? <RotateCcw size={15} className="spin" /> : <Play size={15} />}
                      <span>Predict Region & Normalize</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDialectText('হুনলাম হেতে নাকি কাইলকা বাড়ি যাইব?')}
                      className="btn btn-outline btn-sm"
                    >
                      Preset: Noakhali
                    </button>
                    <button
                      type="button"
                      onClick={() => setDialectText('আঁই তোয়ারে বড্ড ভালা পাই, কদ্দুর আইবা?')}
                      className="btn btn-outline btn-sm"
                    >
                      Preset: Chittagong
                    </button>
                  </div>
                </div>
              </div>

              {/* Dialect Result Box */}
              <div
                style={{
                  background: 'var(--terminal-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  padding: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                  <span>TRANSFORMER_INFERENCE.JSON</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>CONFIDENCE: 96.4%</span>
                </div>

                {dialectResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>PREDICTED REGION:</div>
                      <div style={{ color: '#059669', fontSize: '1.1rem', fontWeight: 700, marginTop: '0.15rem' }}>
                        {dialectResult.detectedRegion}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>STANDARD BENGALI TRANSLATION:</div>
                      <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontFamily: 'var(--font-body)', marginTop: '0.2rem' }}>
                        {dialectResult.standardBengali}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>DETECTED MORPHOLOGICAL FEATURES:</div>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                        {dialectResult.tokenFeatures.map((tok, i) => (
                          <span key={i} className="tech-tag" style={{ color: 'var(--cyan)' }}>{tok}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-dim)', padding: '2rem 0', textAlign: 'center' }}>
                    Click "Predict Region & Normalize" to run dialect feature extraction.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Fraud Engine */}
          {activeTab === 'fraud' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="playground-grid">
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  FinTech Transaction Risk & Anomaly Scorer
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Evaluates velocity patterns, account behavioral deviations, and device telemetry to generate real-time sub-20ms fraud risk verdicts.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                      <span>Transaction Amount (BDT):</span>
                      <strong style={{ color: 'var(--cyan)' }}>৳ {fraudInputs.amount.toLocaleString()}</strong>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                      <span>Hourly Transaction Velocity:</span>
                      <strong style={{ color: 'var(--violet)' }}>{fraudInputs.velocity} attempts / hr</strong>
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
                    <label htmlFor="newDev" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
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
                    <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      RISK PROBABILITY INDEX
                    </div>
                    <div style={{ fontSize: '3.2rem', fontWeight: 800, color: fraudScore.color, fontFamily: 'var(--font-heading)' }}>
                      {(fraudScore.score * 100).toFixed(1)}%
                    </div>
                    <div
                      style={{
                        padding: '0.35rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        background: `${fraudScore.color}15`,
                        border: `1px solid ${fraudScore.color}50`,
                        color: fraudScore.color,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        marginTop: '0.75rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      VERDICT: {fraudScore.riskLevel}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                      Inference Engine: LightGBM + Isolation Forest (Latency: {fraudScore.latency})
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    Adjust parameters and click "Evaluate Anomaly Risk Score" to trigger real-time scoring.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Computer Vision Landmark Tracker */}
          {activeTab === 'vision' && (
            <div>
              <VisionLandmarkCanvas />
            </div>
          )}
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
