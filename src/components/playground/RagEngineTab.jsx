import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, RotateCcw } from 'lucide-react';
import { useSound } from '../../contexts/SoundContext';
import RagRetrievalScene from './RagRetrievalScene';

export default function RagEngineTab() {
  const [ragQuery, setRagQuery] = useState('How does upay handle transaction validation?');
  const [ragResult, setRagResult] = useState(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamedTokens, setStreamedTokens] = useState('');
  const [tokenStats, setTokenStats] = useState({ ttft: 0, tps: 0, count: 0 });
  const streamTimerRef = useRef(null);
  const timeoutRef = useRef(null);

  const { playBeep, playSuccess, playLaser } = useSound();

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Web Speech API Voice Recognition (STT)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition API is not supported in this browser. Please try Chrome.');
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
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const q = overrideQuery || ragQuery;
    setIsLoadingRag(true);
    setStreamedTokens('');
    playLaser();

    const fullAnswer =
      "upay's transaction validation pipeline processes inbound requests through a sub-50ms dual pipeline: fast deterministic ISO8583 rule checks and real-time ML risk inference evaluated against behavioral velocity vectors in Qdrant.";

    timeoutRef.current = setTimeout(() => {
      setRagResult({
        query: q,
        language:
          q.includes('মুই') || q.includes('কীভাবে')
            ? 'Bangla / Multilingual'
            : 'English / Banglish',
        retrievedDocs: [
          {
            score: 0.94,
            title: 'upay API Transaction Lifecycle & ISO8583 Gateway',
            snippet:
              'Incoming payments undergo dual-pass cryptographic validation followed by ML velocity anomaly checks before settlement ledger commit.'
          },
          {
            score: 0.88,
            title: 'Qdrant Hybrid Vector Store Architecture',
            snippet:
              'Embeddings generated via fine-tuned multilingual SentenceTransformers with cosine similarity reranking via CrossEncoder.'
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

      streamTimerRef.current = setInterval(() => {
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
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
          setIsLoadingRag(false);
          playSuccess();
        }
      }, 25);
    }, 450);
  };

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
      className="playground-grid"
    >
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          Hybrid Vector Search & Query Synthesis
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Simulates a dual-pass sparse (BM25) + dense (Qdrant) retrieval pipeline over multilingual
          banking knowledge bases.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label
            style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)'
            }}
          >
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
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
              Try presets:
            </span>
            <button
              type="button"
              onClick={() => {
                setRagQuery('upay merchant payment API integration steps?');
                simulateRag('upay merchant payment API integration steps?');
              }}
              className="tech-tag"
              style={{ cursor: 'pointer' }}
            >
              Merchant API
            </button>
            <button
              type="button"
              onClick={() => {
                setRagQuery('bKash to upay fund transfer limits');
                simulateRag('bKash to upay fund transfer limits');
              }}
              className="tech-tag"
              style={{ cursor: 'pointer' }}
            >
              Transfer Limits
            </button>
          </div>
        </div>
      </div>

      {/* Embedding-space view of the retrieval step */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span>EMBEDDING_SPACE — DENSE RETRIEVAL</span>
          <span>drag to orbit</span>
        </div>
        <RagRetrievalScene
          phase={isLoadingRag ? 'searching' : ragResult ? 'retrieved' : 'idle'}
          docs={ragResult?.retrievedDocs || []}
        />

        <div
          style={{
            display: 'flex',
            gap: '1.1rem',
            flexWrap: 'wrap',
            marginTop: '0.6rem',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)'
          }}
        >
          {[
            { color: 'var(--cyan)', label: 'query vector' },
            { color: 'var(--violet)', label: 'retrieved top-k' },
            { color: 'var(--text-dim)', label: `corpus (${'220'} embeddings)` }
          ].map((item) => (
            <span
              key={item.label}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: item.color,
                  flexShrink: 0
                }}
              />
              {item.label}
            </span>
          ))}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.65rem',
            marginBottom: '1rem',
            color: 'var(--text-dim)',
            fontSize: '0.75rem'
          }}
        >
          <span>SYNTHESIZER_PIPELINE.LOG</span>
          <span style={{ color: '#059669', fontWeight: 600 }}>200 OK</span>
        </div>

        {ragResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--cyan)' }}>&gt; Inferred Language:</span>{' '}
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {ragResult.language}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--violet)' }}>&gt; Dense Vector Hits:</span>
              <div
                style={{
                  marginTop: '0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem'
                }}
              >
                {ragResult.retrievedDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--terminal-row-bg)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      borderLeft: '3px solid var(--cyan)'
                    }}
                  >
                    <div style={{ color: 'var(--cyan)', fontSize: '0.78rem', fontWeight: 600 }}>
                      {doc.title} (Relevance: {doc.score})
                    </div>
                    <div
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.72rem',
                        marginTop: '0.2rem'
                      }}
                    >
                      {doc.snippet}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.25rem'
                }}
              >
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  &gt; Streaming Token Synthesis:
                </span>
                {isLoadingRag && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--cyan)',
                      animation: 'pulseDot 1s infinite'
                    }}
                  >
                    ● STREAMING ({tokenStats.tps} tok/s)
                  </span>
                )}
              </div>
              <p
                style={{
                  color: 'var(--text-main)',
                  marginTop: '0.35rem',
                  lineHeight: 1.55,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem'
                }}
              >
                {streamedTokens || ragResult.generatedAnswer}
                {isLoadingRag && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '14px',
                      background: 'var(--cyan)',
                      marginLeft: '4px',
                      verticalAlign: 'middle',
                      animation: 'blinkCursor 0.5s infinite'
                    }}
                  />
                )}
              </p>
            </div>
            <div
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.72rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <span>
                TTFT: <strong style={{ color: 'var(--cyan)' }}>{tokenStats.ttft || 28}ms</strong> •
                Speed: <strong style={{ color: '#059669' }}>{tokenStats.tps || 135} tok/s</strong>
              </span>
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
  );
}
