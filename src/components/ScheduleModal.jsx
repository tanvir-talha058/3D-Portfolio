import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Check, 
  MessageSquare, 
  Send, 
  User, 
  Mail,
  Video,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';

export default function ScheduleModal({ isOpen, onClose, onToast }) {
  const dialogRef = useRef(null);
  const [topic, setTopic] = useState('Full-Time AI/ML Role');
  const [dateSlot, setDateSlot] = useState('This Week (Priority)');
  const [timeZone, setTimeZone] = useState('GMT+6 (Dhaka / Remote Worldwide)');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!contactEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.7 } });
      onToast("Meeting request confirmed! Tanvir will send Google Meet invite.", "Calendar");

      setTimeout(() => {
        setIsConfirmed(false);
        onClose();
      }, 3000);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '1rem',
        maxWidth: '620px',
        width: 'min(94vw, 620px)',
        margin: 'auto',
        outline: 'none',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}
    >
      <div
        className="glass-card"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {isConfirmed ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Meeting Request Dispatched!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '380px', marginInline: 'auto' }}>
              Tanvir will review your topic (<strong>{topic}</strong>) and send a calendar invitation to <strong>{contactEmail}</strong>.
            </p>
          </div>
        ) : (
          <div>
            <div className="section-tag" style={{ marginBottom: '0.75rem' }}>
              <Video size={12} />
              <span>Direct 1-on-1 Sync</span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Schedule a 15-Minute Technical Call
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Choose a discussion topic and timeframe to connect directly with Tanvir Ahmed.
            </p>

            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
                  DISCUSSION TOPIC:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                  {['Full-Time AI/ML Role', 'AI / RAG Consulting', 'Research Collaboration', 'Casual Intro'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: topic === t ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface-elevated)',
                        border: topic === t ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
                        color: topic === t ? 'var(--cyan)' : 'var(--text-muted)',
                        fontSize: '0.82rem',
                        fontWeight: topic === t ? 600 : 400,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
                  PREFERRED TIMEFRAME:
                </label>
                <select
                  value={dateSlot}
                  onChange={(e) => setDateSlot(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="This Week (Priority)">This Week (Priority Slot)</option>
                  <option value="Next Week">Next Week</option>
                  <option value="Flexible / As soon as possible">Flexible / As soon as possible</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
                  YOUR WORK EMAIL OR PHONE:
                </label>
                <input
                  type="text"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. recruiter@company.com or WhatsApp number"
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a
                  href={portfolioData.personal.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                >
                  <MessageSquare size={14} />
                  <span>Chat on WhatsApp Directly</span>
                </a>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <span>Scheduling...</span>
                  ) : (
                    <>
                      <Calendar size={16} />
                      <span>Confirm 15-Min Slot</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
}
