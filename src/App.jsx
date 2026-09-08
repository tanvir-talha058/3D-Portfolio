import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import NeuralBackground from './components/NeuralBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ProjectModal from './components/ProjectModal';
import ResumeModal from './components/ResumeModal';
import CommandCenter from './components/CommandCenter';
import ScrollProgress from './components/ScrollProgress';
import CursorGlow from './components/CursorGlow';
import SectionSkeleton from './components/SectionSkeleton';
import Toast from './components/Toast';
import { ArrowUp, Eye, Command } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './components/Icons';
import { portfolioData } from './data/portfolioData';
import { useSound } from './contexts/SoundContext';
import { useTheme } from './contexts/ThemeContext';

const Playground = lazy(() => import('./components/Playground'));
const Research = lazy(() => import('./components/Research'));
const Education = lazy(() => import('./components/Education'));

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [playgroundTab, setPlaygroundTab] = useState('3dvector');
  const [toasts, setToasts] = useState([]);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const { playWhoosh } = useSound();
  const { isLightMode, toggleTheme } = useTheme();

  // Keep the floating AI Hub pill hidden until the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      const threshold = heroEl ? Math.max(300, heroEl.offsetHeight * 0.4) : 400;
      setShowFloatingBar(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K for AI Command Center
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = useCallback((message, icon = 'Sparkles') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, icon }]);
    // Flag the toast first so it can play its exit before being unmounted.
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    }, 2700);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const handleEasterEgg = useCallback(() => {
    addToast('Neural burst unlocked — nice clicking!', 'Sparkles');
  }, [addToast]);

  const handleToggleTheme = useCallback(() => {
    const next = !isLightMode;
    toggleTheme();
    addToast(
      next ? 'Switched to Day Mode (Light)' : 'Switched to Night Mode (Dark)',
      next ? 'Sun' : 'Moon'
    );
  }, [isLightMode, toggleTheme, addToast]);

  const openResume = useCallback(() => {
    playWhoosh();
    setResumeOpen(true);
  }, [playWhoosh]);
  const openCommandCenter = useCallback(() => {
    playWhoosh();
    setCommandCenterOpen(true);
  }, [playWhoosh]);

  const handleTriggerInference = useCallback((tab) => {
    const tabMap = {
      rag: 'rag',
      fraud: 'fraud',
      vision: 'vision',
      '3d': '3dvector',
      dialect: 'dialect'
    };
    const target = tabMap[tab] || tab;
    setPlaygroundTab(target);
    const pgEl = document.getElementById('playground');
    if (pgEl) {
      pgEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = () => {
    playWhoosh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Dynamic Backgrounds */}
      <NeuralBackground isLightMode={isLightMode} onEasterEgg={handleEasterEgg} />
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <CursorGlow />

      {/* Navigation */}
      <ScrollProgress />
      <Navbar
        onOpenResume={openResume}
        onOpenCommandCenter={openCommandCenter}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenResume={openResume} />
        <About />
        <Experience />
        <Skills />
        <Projects
          onSelectProject={(project) => {
            playWhoosh();
            setSelectedProject(project);
          }}
          onTriggerInference={handleTriggerInference}
        />
        <Suspense fallback={<SectionSkeleton />}>
          <Research onToast={addToast} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Playground activeTab={playgroundTab} onTabChange={setPlaygroundTab} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Education />
        </Suspense>
        <Contact onToast={addToast} />
      </main>

      {/* Floating Futuristic AI Command Hub Floating Pill (Bottom-Right) */}
      <div
        className="floating-action-bar"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: showFloatingBar ? 1 : 0,
          pointerEvents: showFloatingBar ? 'auto' : 'none',
          transform: showFloatingBar ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease'
        }}
      >
        <button
          type="button"
          onClick={openCommandCenter}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--border-accent)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 15px var(--cyan-glow)',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="cyber-pill-hover ai-hub-btn"
          title="Open AI Command Hub (Ctrl+K / ⌘K)"
          aria-label="Open AI Command Hub"
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--cyan)',
              boxShadow: '0 0 10px var(--cyan)',
              animation: 'pulseDot 1.8s infinite'
            }}
          />
          <Command size={14} />
          <span className="ai-hub-label">⌘K AI Hub</span>
        </button>

        <button
          type="button"
          onClick={scrollToTop}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            backdropFilter: 'blur(12px)'
          }}
          className="scroll-top-btn"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp size={16} />
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          // Extra bottom clearance keeps the last row from sitting under the
          // fixed floating-action-bar (AI Hub pill + scroll-top button),
          // which always occupies the bottom-right 24-64px of the viewport.
          padding: '4rem 0 6rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '0.35rem'
                }}
              >
                {portfolioData.personal.name} <span style={{ color: 'var(--cyan)' }}>.ai</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', maxWidth: '400px' }}>
                AI/ML Engineer & Researcher at upay (UCB Fintech) • Multilingual RAG • Computer
                Vision • Low-Latency AI Systems.
              </p>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}
            >
              <button
                type="button"
                onClick={openResume}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                <Eye size={14} />
                <span>Resume PDF</span>
              </button>

              <a
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-icon"
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </a>

              <a
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-icon"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-dim)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              © {new Date().getFullYear()} {portfolioData.personal.name}. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>
                Engineered with React 19, Three.js 3D WebGL & Native Web Audio Synthesizer
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cybernetic Command Center Modal */}
      <CommandCenter
        isOpen={commandCenterOpen}
        onClose={() => setCommandCenterOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
        toggleTheme={handleToggleTheme}
        onTriggerInference={handleTriggerInference}
      />

      {/* Project Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* In-Page Resume PDF Viewer Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      <style>{`
        .cyber-pill-hover:hover {
          transform: translateY(-3px) scale(1.04);
          border-color: var(--cyan) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 25px var(--cyan-glow) !important;
        }

        /* Collapse the AI Hub pill to an icon-only button on mobile so it
           doesn't overlap page content (its full label is quite wide relative
           to a narrow viewport). */
        @media (max-width: 768px) {
          .floating-action-bar {
            bottom: 16px !important;
            right: 16px !important;
          }
          .ai-hub-btn {
            width: 40px;
            height: 40px;
            padding: 0 !important;
            justify-content: center;
          }
          .ai-hub-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
