import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isLightMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      title={isLightMode ? 'Switch to Night Mode (Dark)' : 'Switch to Day Mode (Light)'}
      style={{
        width: '38px',
        height: '38px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        color: isLightMode ? '#f59e0b' : '#38bdf8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isLightMode ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.4)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyan)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-medium)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isLightMode ? (
        <Sun size={18} className="theme-toggle-icon" />
      ) : (
        <Moon size={18} className="theme-toggle-icon" />
      )}
    </button>
  );
}
