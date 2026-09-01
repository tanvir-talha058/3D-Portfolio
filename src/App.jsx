import React, { useState, useEffect } from 'react';
import NeuralBackground from './components/NeuralBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Research from './components/Research';
import Playground from './components/Playground';
import Education from './components/Education';
import Contact from './components/Contact';
import ProjectModal from './components/ProjectModal';
import RecruiterModal from './components/RecruiterModal';
import ResumeModal from './components/ResumeModal';
import CommandCenter from './components/CommandCenter';
import Toast from './components/Toast';
import { ArrowUp, Mail, Sparkles, Briefcase, Eye, Command, Terminal, Zap } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './components/Icons';
import { portfolioData } from './data/portfolioData';
import { useCyberSound } from './hooks/useCyberSound';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('portfolio_theme') === 'light';
  });
  const [toasts, setToasts] = useState([]);
  const { playWhoosh, playSuccess } = useCyberSound();

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('portfolio_theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('portfolio_theme', 'dark');
    }
  }, [isLightMode]);

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

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      addToast(next ? "Switched to Day Mode (Light)" : "Switched to Night Mode (Dark)", next ? "Sun" : "Moon");
      return next;
    });
  };

  const addToast = (message, icon = 'Sparkles') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const scrollToTop = () => {
    playWhoosh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Dynamic Backgrounds */}
      <NeuralBackground isLightMode={isLightMode} />
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Navigation */}
      <Navbar
        onOpenRecruiter={() => { playWhoosh(); setRecruiterOpen(true); }}
        onOpenResume={() => { playWhoosh(); setResumeOpen(true); }}
        onOpenCommandCenter={() => { playWhoosh(); setCommandCenterOpen(true); }}
        isLightMode={isLightMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenRecruiter={() => { playWhoosh(); setRecruiterOpen(true); }}
          onOpenResume={() => { playWhoosh(); setResumeOpen(true); }}
          isLightMode={isLightMode}
        />
        <About />
        <Experience />
        <Skills />
        <Projects onSelectProject={(project) => { playWhoosh(); setSelectedProject(project); }} />
        <Research onToast={addToast} />
        <Playground />
        <Education />
        <Contact onToast={addToast} />
      </main>

      {/* Floating Futuristic AI Command Hub Floating Pill (Bottom-Right) */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <button
          type="button"
          onClick={() => {
            playWhoosh();
            setCommandCenterOpen(true);
          }}
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
          className="cyber-pill-hover"
          title="Open AI Command Hub (Ctrl+K / ⌘K)"
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)', animation: 'pulseDot 1.8s infinite' }} />
          <Command size={14} />
          <span>⌘K AI Hub</span>
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
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp size={16} />
        </button>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '4rem 0 2rem', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {portfolioData.personal.name} <span style={{ color: 'var(--cyan)' }}>.ai</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', maxWidth: '400px' }}>
                AI/ML Engineer & Researcher at upay (UCB Fintech) • Multilingual RAG • Computer Vision • Low-Latency AI Systems.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => { playWhoosh(); setRecruiterOpen(true); }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                <Briefcase size={14} />
                <span>Recruiter View</span>
              </button>

              <button
                type="button"
                onClick={() => { playWhoosh(); setResumeOpen(true); }}
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-dim)', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              © {new Date().getFullYear()} {portfolioData.personal.name}. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Engineered with React 19, Three.js 3D WebGL & Native Web Audio Synthesizer</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cybernetic Command Center Modal */}
      <CommandCenter
        isOpen={commandCenterOpen}
        onClose={() => setCommandCenterOpen(false)}
        onOpenRecruiter={() => setRecruiterOpen(true)}
        onOpenResume={() => setResumeOpen(true)}
        isLightMode={isLightMode}
        toggleTheme={toggleTheme}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Recruiter 1-Page Cheat Sheet Modal */}
      <RecruiterModal
        isOpen={recruiterOpen}
        onClose={() => setRecruiterOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* In-Page Resume PDF Viewer Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      <style>{`
        .cyber-pill-hover:hover {
          transform: translateY(-3px) scale(1.04);
          border-color: var(--cyan) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 25px var(--cyan-glow) !important;
        }
      `}</style>
    </div>
  );
}
