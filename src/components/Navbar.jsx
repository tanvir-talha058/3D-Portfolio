import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Menu, 
  X, 
  ArrowUpRight, 
  Terminal, 
  Briefcase, 
  Eye,
  Volume2,
  VolumeX,
  Command
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { portfolioData } from '../data/portfolioData';
import { useCyberSound } from '../hooks/useCyberSound';

export default function Navbar({ 
  onOpenRecruiter, 
  onOpenResume, 
  onOpenCommandCenter, 
  isLightMode, 
  onToggleTheme 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { soundEnabled, toggleSound, playBeep } = useCyberSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['about', 'experience', 'skills', 'projects', 'research', 'playground', 'education', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

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
          ? (isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(8, 10, 15, 0.95)')
          : (isLightMode ? 'rgba(248, 250, 252, 0.88)' : 'rgba(8, 10, 15, 0.85)'),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
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
          <img
            src="/Tanvir.png"
            alt="Tanvir Ahmed"
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
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Tanvir<span style={{ color: 'var(--cyan)' }}>.ai</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', gap: '1.3rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => playBeep(640, 'sine', 0.02)}
              style={{
                fontSize: '0.86rem',
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
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'var(--cyan)',
                    boxShadow: '0 0 8px var(--cyan)',
                    borderRadius: 'var(--radius-full)'
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
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: soundEnabled ? '#10b981' : 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={`Audio FX: ${soundEnabled ? 'Active (Click to Mute)' : 'Muted (Click to Enable)'}`}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* AI Command Center Trigger Button */}
          <button
            type="button"
            onClick={onOpenCommandCenter}
            className="btn btn-outline btn-sm desktop-only-btn"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-mono)',
              borderColor: 'var(--border-accent)',
              color: 'var(--cyan)',
              background: 'var(--bg-card)'
            }}
            title="Open AI Command Hub (Ctrl+K / ⌘K)"
          >
            <Command size={12} />
            <span>⌘K Hub</span>
          </button>

          {/* Day / Night Theme Switcher */}
          <ThemeToggle isLightMode={isLightMode} onToggle={onToggleTheme} />

          {/* Desktop Recruiter Cheat Sheet Trigger */}
          <button
            type="button"
            onClick={onOpenRecruiter}
            className="btn btn-outline btn-sm desktop-only-btn"
            style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
            id="desktop-recruiter-btn"
            title="Open 1-Page Recruiter Overview"
          >
            <Briefcase size={13} />
            <span>Recruiter Mode</span>
          </button>

          {/* Desktop Resume PDF Viewer Button */}
          <button
            type="button"
            onClick={onOpenResume}
            className="btn btn-primary btn-sm desktop-only-btn"
            id="desktop-resume-btn"
          >
            <Eye size={13} />
            <span>View CV</span>
          </button>

          {/* Mobile Menu Trigger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-main)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Full Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            width: '100%',
            maxHeight: 'calc(100vh - var(--nav-height))',
            overflowY: 'auto',
            background: isLightMode ? '#ffffff' : '#080a0f',
            borderBottom: '1px solid var(--border-medium)',
            padding: '1.25rem 1.25rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            backdropFilter: 'blur(24px)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 99
          }}
        >
          {/* Quick Command Center in Mobile */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCommandCenter();
            }}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}
          >
            <Command size={15} />
            <span>Open AI Command Hub (⌘K)</span>
          </button>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => {
                playBeep(640);
                setMobileMenuOpen(false);
              }}
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: activeSection === link.id ? 'var(--cyan)' : 'var(--text-main)',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{link.label}</span>
              {activeSection === link.id && <span style={{ color: 'var(--cyan)', fontSize: '0.78rem' }}>● Active</span>}
            </a>
          ))}

          {/* Quick Action CTAs in Mobile Drawer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRecruiter();
              }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Briefcase size={15} />
              <span>Recruiter Cheat Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Eye size={15} />
              <span>View PDF Resume</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .desktop-only-btn {
          display: none !important;
        }
        .mobile-toggle {
          display: flex !important;
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
