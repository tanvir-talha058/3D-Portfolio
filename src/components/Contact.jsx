import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  MapPin,
  MessageSquare
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';

export default function Contact({ onToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
      setEmailCopied(true);
      onToast("Email address copied to clipboard!", "Mail");
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setEmailCopied(false), 2500);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);

    // Form submission simulation
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
      onToast("Message transmitted successfully! Tanvir will respond soon.", "Send");
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setSentSuccess(false);
      }, 5000);
    }, 1100);
  };

  return (
    <section id="contact" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <MessageSquare size={13} />
            <span>Get In Touch</span>
          </div>
          <h2 className="section-title">
            Let's Build Something <span className="gradient-text">Extraordinary</span>
          </h2>
          <p className="section-subtitle">
            Whether you have a breakthrough AI/ML project, engineering role, or research collaboration in mind, I'd love to connect.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }} className="contact-grid">
          
          {/* Left: Direct Contact Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Email Card with 1-Click Copy */}
            <div
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                    Direct Email
                  </div>
                  <a href={`mailto:${portfolioData.personal.email}`} style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {portfolioData.personal.email}
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
                title="Copy Email Address"
              >
                {emailCopied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                <span>{emailCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* WhatsApp / Phone Card */}
            <a
              href={portfolioData.personal.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                    WhatsApp Direct Chat
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {portfolioData.personal.phone}
                  </div>
                </div>
              </div>

              <span className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
                Chat Now
              </span>
            </a>

            {/* LinkedIn Card */}
            <a
              href={portfolioData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--violet)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <LinkedinIcon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                  LinkedIn Profile
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  linkedin.com/in/{portfolioData.personal.linkedinUsername}
                </div>
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href={portfolioData.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <GithubIcon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                  GitHub Repositories
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  github.com/{portfolioData.personal.githubUsername}
                </div>
              </div>
            </a>

          </div>

          {/* Right: Direct Transmission Form */}
          <div className="glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', border: '1px solid var(--border-medium)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              Dispatch a Message
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Fill out the details below and I'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                  YOUR NAME:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Henderson"
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem 1rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                  YOUR EMAIL:
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@company.com"
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem 1rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                  MESSAGE:
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project, team, or opportunity..."
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem 1rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    resize: 'vertical',
                    outline: 'none'
                  }}
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
                    <Check size={16} color="#050811" />
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
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 0.95fr 1.05fr !important;
          }
        }
      `}</style>
    </section>
  );
}
