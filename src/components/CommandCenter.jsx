import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import { useTheme } from '../contexts/ThemeContext';
import { getCommandCenterCommands } from '../data/commandCenterCommands';
import CommandResultItem from './CommandResultItem';

export default function CommandCenter({
  isOpen,
  onClose,
  onOpenResume,
  toggleTheme,
  onTriggerInference
}) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const selectedItemRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  // Reset the selection during render when the query changes, rather than
  // in an effect — avoids an extra render pass (React's recommended
  // pattern for adjusting state based on a prop/state change).
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setSelectedIndex(0);
  }
  const { soundEnabled, toggleSound, playBeep, playSuccess, playWhoosh } = useSound();
  const { isLightMode } = useTheme();

  const commands = getCommandCenterCommands({
    onClose,
    onOpenResume,
    onTriggerInference,
    toggleTheme,
    toggleSound,
    isLightMode,
    soundEnabled
  });

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (!dialog.open) {
      dialog.showModal();
      playWhoosh();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen, playWhoosh]);

  useEffect(() => {
    selectedItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      playBeep(600, 'sine', 0.02);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1)
      );
      playBeep(600, 'sine', 0.02);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        playSuccess();
        filteredCommands[selectedIndex].action();
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-label="AI Command Center"
      style={{
        border: 'none',
        background: 'transparent',
        padding: '1rem',
        maxWidth: '680px',
        width: 'min(92vw, 680px)',
        margin: 'auto',
        outline: 'none',
        maxHeight: '88vh',
        overflow: 'hidden'
      }}
    >
      <div
        className="glass-card"
        style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82vh'
        }}
      >
        {/* Top Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-elevated)'
          }}
        >
          <Terminal size={20} color="var(--cyan)" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-center-results"
            aria-activedescendant={
              filteredCommands[selectedIndex]
                ? `cmd-${filteredCommands[selectedIndex].id}`
                : undefined
            }
            aria-label="Search commands"
            placeholder="Type a command or search (e.g. RAG, Fraud, Resume)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              paddingRight: '0.75rem',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-card)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)'
            }}
          >
            <span>ESC to close</span>
          </div>
        </div>

        {/* Telemetry Status Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.4rem 1.4rem',
            background: 'var(--terminal-bg)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)'
          }}
        >
          <span>
            NODE: <strong style={{ color: 'var(--cyan)' }}>TANVIR-AI-CORE</strong>
          </span>
          <span>
            LATENCY: <strong style={{ color: '#059669' }}>28ms</strong>
          </span>
          <span>
            AUDIO FX:{' '}
            <strong style={{ color: soundEnabled ? 'var(--emerald-light)' : 'var(--text-dim)' }}>
              {soundEnabled ? 'ACTIVE' : 'MUTED'}
            </strong>
          </span>
        </div>

        {/* Results List */}
        <div
          id="command-center-results"
          role="listbox"
          aria-label="Available commands"
          style={{
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            flex: 1
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem'
              }}
            >
              No commands matching "{searchQuery}". Try "RAG", "CV", "Theme", or "Resume".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <CommandResultItem
                key={cmd.id}
                command={cmd}
                isSelected={idx === selectedIndex}
                itemRef={selectedItemRef}
                onSelect={() => setSelectedIndex(idx)}
                onExecute={() => {
                  playSuccess();
                  cmd.action();
                }}
              />
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.65rem 1.4rem',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)'
          }}
        >
          <span>Use ↑↓ to navigate • ↵ to execute</span>
          <span>⚡ Tanvir AI Command Center</span>
        </div>
      </div>
    </dialog>
  );
}
