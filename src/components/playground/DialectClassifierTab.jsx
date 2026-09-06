import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useSound } from '../../contexts/SoundContext';

export default function DialectClassifierTab() {
  const [dialectText, setDialectText] = useState('মুই তোরে ভালোবাসুম, তুই কুন্ঠে যাস?');
  const [dialectResult, setDialectResult] = useState(null);
  const [isLoadingDialect, setIsLoadingDialect] = useState(false);
  const timeoutRef = useRef(null);

  const { playSuccess, playLaser } = useSound();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const simulateDialect = (overrideText) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const text = overrideText || dialectText;
    setIsLoadingDialect(true);
    playLaser();

    timeoutRef.current = setTimeout(() => {
      let result = {
        detectedRegion: 'Rangpur / North Bengal (রংপুর অঞ্চল)',
        confidence: 0.964,
        standardBengali: 'আমি তোমাকে ভালোবাসি, তুমি কোথায় যাচ্ছ?',
        tokenFeatures: [
          'মুই (1st person pronoun)',
          'ভালোবাসুম (Regional verb)',
          'কুন্ঠে (Locative interrogative)'
        ],
        model: 'Bangla Dialect Transformer (20,090 corpus)'
      };

      if (
        text.includes('হেতে') ||
        text.includes('কাইলকা') ||
        text.includes('হুনলাম') ||
        text.includes('নোয়াখালী')
      ) {
        result = {
          detectedRegion: 'Noakhali (নোয়াখালী অঞ্চল)',
          confidence: 0.978,
          standardBengali: 'শুনলাম সে নাকি আগামীকাল বাড়ি যাবে?',
          tokenFeatures: [
            'হুনলাম (Phonetic /s/ to /h/ shift)',
            'হেতে (3rd person singular pronoun)',
            'কাইলকা (Temporal adverb: tomorrow)'
          ],
          model: 'Bangla Dialect Transformer (20,090 corpus)'
        };
      } else if (
        text.includes('আঁই') ||
        text.includes('তোয়ারে') ||
        text.includes('কদ্দুর') ||
        text.includes('চট্টগ্রাম')
      ) {
        result = {
          detectedRegion: 'Chittagong (চট্টগ্রাম অঞ্চল)',
          confidence: 0.985,
          standardBengali: 'আমি তোমাকে অনেক ভালোবাসি, কখন আসবে?',
          tokenFeatures: [
            'আঁই (1st person nasal pronoun)',
            'তোয়ারে (2nd person accusative)',
            'বড্ড ভালা পাই (Intensified predicate)',
            'কদ্দুর (Spatial/temporal marker)'
          ],
          model: 'Bangla Dialect Transformer (20,090 corpus)'
        };
      } else if (
        text.includes('কিতা') ||
        text.includes('খাইছো') ||
        text.includes('সিলেট') ||
        text.includes('মাতো')
      ) {
        result = {
          detectedRegion: 'Sylhet (সিলেট অঞ্চল)',
          confidence: 0.961,
          standardBengali: 'তুমি কেমন আছো? কি কথা বলছো?',
          tokenFeatures: ['কিতা (Interrogative pronoun)', 'মাতো (Speech / talk verb)'],
          model: 'Bangla Dialect Transformer (20,090 corpus)'
        };
      }

      setDialectResult(result);
      setIsLoadingDialect(false);
      playSuccess();
    }, 450);
  };

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
      className="playground-grid"
    >
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          Bangla Regional Dialect Transformer
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Classifies regional dialects across 8 major districts of Bangladesh using fine-tuned
          m-BERT & RoBERTa representations trained on 20,090 curated dialectal samples.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label
            style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)'
            }}
          >
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
              onClick={() => simulateDialect()}
              disabled={isLoadingDialect}
              className="btn btn-primary"
            >
              {isLoadingDialect ? <RotateCcw size={15} className="spin" /> : <Play size={15} />}
              <span>Predict Region & Normalize</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const text = 'হুনলাম হেতে নাকি কাইলকা বাড়ি যাইব?';
                setDialectText(text);
                simulateDialect(text);
              }}
              className="btn btn-outline btn-sm"
            >
              Preset: Noakhali
            </button>
            <button
              type="button"
              onClick={() => {
                const text = 'আঁই তোয়ারে বড্ড ভালা পাই, কদ্দুর আইবা?';
                setDialectText(text);
                simulateDialect(text);
              }}
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
          <span>TRANSFORMER_INFERENCE.JSON</span>
          <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>CONFIDENCE: 96.4%</span>
        </div>

        {dialectResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>PREDICTED REGION:</div>
              <div
                style={{
                  color: '#059669',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginTop: '0.15rem'
                }}
              >
                {dialectResult.detectedRegion}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                STANDARD BENGALI TRANSLATION:
              </div>
              <div
                style={{
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-body)',
                  marginTop: '0.2rem'
                }}
              >
                {dialectResult.standardBengali}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                DETECTED MORPHOLOGICAL FEATURES:
              </div>
              <div
                style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}
              >
                {dialectResult.tokenFeatures.map((tok, i) => (
                  <span key={i} className="tech-tag" style={{ color: 'var(--cyan)' }}>
                    {tok}
                  </span>
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
  );
}
