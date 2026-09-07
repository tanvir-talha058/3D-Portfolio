import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';

const FORMSPREE_ENDPOINT_ID = import.meta.env.VITE_FORMSPREE_ENDPOINT_ID;

const FIELD_STYLE = {
  width: '100%',
  background: 'var(--bg-surface-elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.8rem 1rem',
  color: 'var(--text-main)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  outline: 'none'
};

const LABEL_STYLE = {
  display: 'block',
  fontSize: '0.8rem',
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-dim)',
  marginBottom: '0.35rem'
};

const QUICK_INTENTS = [
  {
    id: 'hiring',
    icon: '💼',
    label: 'Hiring for AI Role',
    subject: 'AI Engineering Opportunity',
    message: 'Hi Tanvir, we are looking for a skilled AI/ML Engineer to join our team. We were impressed by your production AI and systems work and would love to discuss an opportunity with you.'
  },
  {
    id: 'research',
    icon: '🔬',
    label: 'Research Collaboration',
    subject: 'AI Research Collaboration',
    message: 'Hi Tanvir, I came across your published research work and would love to explore a research collaboration or discuss technical methodologies in your papers.'
  },
  {
    id: 'consulting',
    icon: '⚡',
    label: 'System Consultation',
    subject: 'AI / Architecture Consultation',
    message: 'Hi Tanvir, I have an upcoming technical challenge involving high-throughput data processing / AI retrieval systems and would love your guidance.'
  }
];

/**
 * The "Dispatch a Message" form — its own state, validation and Formspree
 * submission, separate from the surrounding section layout in Contact.jsx.
 */
export default function ContactForm({ onToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSelectIntent = (intent) => {
    if (selectedIntent === intent.id) {
      setSelectedIntent(null);
    } else {
      setSelectedIntent(intent.id);
      setFormData((prev) => ({
        ...prev,
        subject: intent.subject,
        message: intent.message
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    if (!FORMSPREE_ENDPOINT_ID) {
      onToast(
        `Contact form isn't configured yet — email me directly at ${portfolioData.personal.email}`,
        'Mail'
      );
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ENDPOINT_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Formspree request failed');

      setSentSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
      onToast('Message transmitted successfully! Tanvir will respond soon.', 'Send');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSelectedIntent(null);
      setTimeout(() => setSentSuccess(false), 5000);
    } catch {
      onToast(
        `Couldn't send — please email me directly at ${portfolioData.personal.email}`,
        'Mail'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
        Dispatch a Message
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        Fill out the details below or select a quick topic to get in touch.
      </p>

      {/* Quick Intent Chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span
          style={{
            display: 'block',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
            marginBottom: '0.45rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          Quick Inquiry Topic:
        </span>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {QUICK_INTENTS.map((intent) => {
            const isSelected = selectedIntent === intent.id;
            return (
              <button
                key={intent.id}
                type="button"
                onClick={() => handleSelectIntent(intent)}
                className="tech-tag"
                style={{
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  padding: '0.35rem 0.7rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--border-subtle)'}`,
                  color: isSelected ? 'var(--cyan)' : 'var(--text-main)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: isSelected ? 600 : 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{intent.icon}</span>
                <span>{intent.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
      >
        <div>
          <label htmlFor="contact-name" style={LABEL_STYLE}>
            YOUR NAME:
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Alex Henderson"
            style={FIELD_STYLE}
          />
        </div>

        <div>
          <label htmlFor="contact-email" style={LABEL_STYLE}>
            YOUR EMAIL:
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. alex@company.com"
            style={FIELD_STYLE}
          />
        </div>

        <div>
          <label htmlFor="contact-message" style={LABEL_STYLE}>
            MESSAGE:
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows="4"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell me about your project, team, or opportunity..."
            style={{ ...FIELD_STYLE, resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.35rem' }}
        >
          {isSending ? (
            <span>Transmitting...</span>
          ) : sentSuccess ? (
            <>
              <Check size={16} color="#050811" className="anim-pop" />
              <span>Dispatched Successfully!</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Send Transmission</span>
            </>
          )}
        </button>
      </form>
    </>
  );
}
