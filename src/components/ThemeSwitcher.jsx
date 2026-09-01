import React from 'react';
import { Palette } from 'lucide-react';

export default function ThemeSwitcher({ currentTheme, onThemeChange }) {
  const themes = [
    { id: 'cyan', name: 'Executive Slate (Default)', color: '#38bdf8' },
    { id: 'amber', name: 'Monochrome Platinum', color: '#f1f5f9' },
    { id: 'violet', name: 'DeepMind Cobalt', color: '#818cf8' },
    { id: 'emerald', name: 'Nordic Sage', color: '#34d399' }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
      <Palette size={13} color="var(--cyan)" />
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onThemeChange(t.id)}
            title={`Switch to ${t.name}`}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: t.color,
              border: currentTheme === t.id ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              boxShadow: currentTheme === t.id ? `0 0 10px ${t.color}` : 'none',
              transition: 'all 0.2s ease',
              transform: currentTheme === t.id ? 'scale(1.15)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
