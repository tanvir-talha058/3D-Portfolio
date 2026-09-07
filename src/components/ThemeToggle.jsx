import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isLightMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      title={isLightMode ? 'Switch to Night Mode (Dark)' : 'Switch to Day Mode (Light)'}
      className="theme-toggle-btn"
      style={{
        width: '38px',
        height: '38px',
        minWidth: '38px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        // Fixed icon accent colors, deliberately independent of the theme's
        // --amber/--cyan tokens (those shift value between light/dark; the
        // sun/moon glyph should not dim to the light-mode amber shade).
        color: isLightMode ? '#f59e0b' : '#38bdf8',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isLightMode ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.4)'
      }}
    >
      {isLightMode ? (
        <Sun size={17} className="theme-toggle-icon" />
      ) : (
        <Moon size={17} className="theme-toggle-icon" />
      )}
    </button>
  );
}
