import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Eye, Volume2, VolumeX, Command } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSound } from '../contexts/SoundContext';
import { useTheme } from '../contexts/ThemeContext';
import IconButton from './IconButton';
import MobileMenu from './MobileMenu';
import { portfolioData } from '../data/portfolioData';
import { SECTION_IDS } from '../data/navSections';
import { useActiveSection } from '../hooks/useActiveSection';

export default function Navbar({ onOpenResume, onOpenCommandCenter, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileToggleRef = useRef(null);
  const { soundEnabled, toggleSound, playBeep } = useSound();
  const { isLightMode } = useTheme();
  const activeSection = useActiveSection(SECTION_IDS, { initial: 'hero' });

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Research', href: '#research', id: 'research' },
    { label: 'AI Playground', href: '#playground', id: 'playground' },
    { label: 'Contact', href: '#contact', id: 'contact' }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 'var(--nav-height)',
        zIndex: 100,
        background: scrolled
          ? isLightMode
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(8, 10, 15, 0.95)'
          : isLightMode
            ? 'rgba(248, 250, 252, 0.88)'
            : 'rgba(8, 10, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid var(--border-medium)'
          : '1px solid var(--border-subtle)',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        {/* Brand with Avatar */}
        <a
          href="#"
          onClick={() => playBeep(520)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}
        >
          <picture>
            <source srcSet="/avatar-160.webp" type="image/webp" />
            <img
              src="/avatar-160.png"
              alt={portfolioData.personal.name}
              width="34"
              height="34"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--cyan)',
                boxShadow: '0 0 10px var(--cyan-glow)'
              }}
            />
          </picture>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '800',
                fontSize: '1.15rem',
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap'
              }}
            >
              Tanvir <span style={{ color: 'var(--cyan)' }}>Ahmed</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div
          style={{ display: 'none', gap: '1.3rem', alignItems: 'center' }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => playBeep(640, 'sine', 0.02)}
              className="nav-link"
              style={{
                fontSize: '0.85rem',
                fontWeight: '500',
                color: activeSection === link.id ? 'var(--cyan)' : 'var(--text-muted)',
                position: 'relative',
                padding: '0.4rem 0',
                transition: 'color 0.2s ease'
              }}
            >
              {link.label}
              {activeSection === link.id && (
                <span
                  className="nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'var(--cyan)',
                    boxShadow: '0 0 8px var(--cyan)',
                    borderRadius: 'var(--radius-full)',
                    zIndex: 1
                  }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Right Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
          {/* Cybernetic Audio FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="nav-action-btn sound-toggle-btn"
            style={{
              width: '38px',
              height: '38px',
              minWidth: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              color: soundEnabled ? '#10b981' : 'var(--text-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isLightMode
                ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                : '0 2px 8px rgba(0, 0, 0, 0.4)'
            }}
            title={`Audio FX: ${soundEnabled ? 'Active (Click to Mute)' : 'Muted (Click to Enable)'}`}
            aria-label={soundEnabled ? 'Mute audio effects' : 'Enable audio effects'}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          {/* AI Command Center Trigger Button */}
          <button
            type="button"
            onClick={onOpenCommandCenter}
            className="btn btn-outline desktop-only-btn"
            style={{
              height: '38px',
              minHeight: '38px',
              padding: '0 0.95rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              borderColor: 'var(--border-accent)',
              color: 'var(--cyan)',
              background: 'var(--bg-surface-elevated)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: isLightMode
                ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                : '0 2px 8px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title="Open AI Command Hub (Ctrl+K / ⌘K)"
          >
            <Command size={14} />
            <span>⌘K Hub</span>
          </button>

          {/* Day / Night Theme Switcher */}
          <ThemeToggle isLightMode={isLightMode} onToggle={onToggleTheme} />

          {/* Desktop Resume PDF Viewer Button */}
          <button
            type="button"
            onClick={onOpenResume}
            className="btn btn-primary desktop-only-btn"
            id="desktop-resume-btn"
            style={{
              height: '38px',
              minHeight: '38px',
              padding: '0 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem'
            }}
          >
            <Eye size={14} />
            <span>View CV</span>
          </button>

          {/* Mobile Menu Trigger Button */}
          <IconButton
            ref={mobileToggleRef}
            icon={mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            shape="square"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-main)' }}
            className="mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          />
        </div>
      </div>

      {/* Mobile Menu Full Dropdown */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        activeSection={activeSection}
        isLightMode={isLightMode}
        playBeep={playBeep}
        onClose={() => setMobileMenuOpen(false)}
        onOpenCommandCenter={onOpenCommandCenter}
        onOpenResume={onOpenResume}
        returnFocusRef={mobileToggleRef}
      />

      <style>{`
        .desktop-only-btn {
          display: none !important;
        }
        .mobile-toggle {
          display: flex !important;
        }

        .sound-toggle-btn:hover {
          border-color: var(--cyan);
          transform: scale(1.05);
        }

        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .desktop-only-btn { display: inline-flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
