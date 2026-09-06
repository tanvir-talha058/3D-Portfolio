import React, { useState } from 'react';
import { Mail, Copy, Check, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';
import ContactMethodCard from './ContactMethodCard';
import ContactForm from './ContactForm';

export default function Contact({ onToast }) {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard
      .writeText(portfolioData.personal.email)
      .then(() => {
        setEmailCopied(true);
        onToast('Email address copied to clipboard!', 'Mail');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        setTimeout(() => setEmailCopied(false), 2500);
      })
      .catch(() => {
        onToast(`Couldn't copy — my email is ${portfolioData.personal.email}`, 'Mail');
      });
  };

  return (
    <section id="contact" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <Reveal className="section-header" variant="up" blur>
          <div className="section-tag">
            <MessageSquare size={13} />
            <ScrambleText text="Get In Touch" />
          </div>
          <h2 className="section-title">
            Let's Build Something <span className="gradient-text">Extraordinary</span>
          </h2>
          <p className="section-subtitle">
            Whether you have a breakthrough AI/ML project, engineering role, or research
            collaboration in mind, I'd love to connect.
          </p>
        </Reveal>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}
          className="contact-grid"
        >
          {/* Left: Direct Contact Methods */}
          <Reveal variant="left" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ContactMethodCard
              icon={<Mail size={20} />}
              iconBg="rgba(56, 189, 248, 0.1)"
              iconColor="var(--cyan)"
              label="Direct Email"
              value={
                <a href={`mailto:${portfolioData.personal.email}`} style={{ color: 'inherit' }}>
                  {portfolioData.personal.email}
                </a>
              }
              action={
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', flexShrink: 0 }}
                  title="Copy Email Address"
                >
                  {emailCopied ? (
                    <Check size={14} color="var(--emerald-light)" className="anim-pop" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>{emailCopied ? 'Copied' : 'Copy'}</span>
                </button>
              }
            />

            <ContactMethodCard
              as="a"
              href={portfolioData.personal.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              hoverAccent="#10b981"
              icon={<MessageSquare size={20} />}
              iconBg="rgba(16, 185, 129, 0.1)"
              iconColor="var(--emerald)"
              label="WhatsApp Direct Chat"
              value={portfolioData.personal.phone}
              action={
                <span
                  className="btn btn-outline btn-sm"
                  style={{
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: 'var(--emerald-light)',
                    flexShrink: 0
                  }}
                >
                  Chat Now
                </span>
              }
            />

            <ContactMethodCard
              as="a"
              href={portfolioData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              hoverAccent="var(--border-accent)"
              icon={<LinkedinIcon size={20} />}
              iconBg="rgba(99, 102, 241, 0.1)"
              iconColor="var(--violet)"
              label="LinkedIn Profile"
              value={`linkedin.com/in/${portfolioData.personal.linkedinUsername}`}
            />

            <ContactMethodCard
              as="a"
              href={portfolioData.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              hoverAccent="var(--border-accent)"
              icon={<GithubIcon size={20} />}
              iconBg="var(--bg-surface-elevated)"
              iconColor="var(--text-main)"
              label="GitHub Repositories"
              value={`github.com/${portfolioData.personal.githubUsername}`}
            />
          </Reveal>

          {/* Right: Direct Transmission Form */}
          <Reveal
            variant="right"
            delay={140}
            className="glass-card"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              border: '1px solid var(--border-medium)'
            }}
          >
            <ContactForm onToast={onToast} />
          </Reveal>
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
