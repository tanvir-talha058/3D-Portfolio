import React, { useEffect, useRef } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import IconButton from './IconButton';

export default function ResumeModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const pdfUrl = portfolioData?.personal?.resumeUrl || '/updated_resume_by_Tanvir.pdf';

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '0.75rem',
        maxWidth: '960px',
        width: 'min(96vw, 960px)',
        margin: 'auto',
        outline: 'none',
        maxHeight: '94vh',
        overflowY: 'auto'
      }}
    >
      <div
        className="glass-card"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1rem, 2.5vw, 1.75rem)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: 'min(88vh, 850px)'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {portfolioData.personal.name} — Curriculum Vitae
              </h3>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                AI/ML Engineer & Researcher • Updated 2026
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={pdfUrl}
              download="Tanvir_Ahmed_AI_ML_Resume.pdf"
              className="btn btn-outline btn-sm"
              title="Download PDF file"
            >
              <Download size={14} />
              <span>Download</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              title="Open in new tab"
            >
              <ExternalLink size={14} />
              <span>Full Tab</span>
            </a>

            <IconButton
              icon={<X size={16} />}
              size={34}
              onClick={onClose}
              aria-label="Close resume preview"
            />
          </div>
        </div>

        {/* Embedded Iframe PDF Viewer */}
        <div
          style={{
            flex: 1,
            width: '100%',
            background: '#1a1f2c',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}
        >
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title={`${portfolioData.personal.name} Resume PDF`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </dialog>
  );
}
