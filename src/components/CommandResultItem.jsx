import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * One row in the Command Center's results list — icon, title/category,
 * description, and the trailing arrow that highlights on selection.
 */
export default function CommandResultItem({ command, isSelected, onSelect, onExecute, itemRef }) {
  // Brief visual pulse in sync with the success sound `onExecute` plays.
  // Most commands close the dialog immediately, so this is mainly visible
  // for the few (e.g. the audio toggle) that leave it open.
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (!pulsing) return undefined;
    const timer = setTimeout(() => setPulsing(false), 400);
    return () => clearTimeout(timer);
  }, [pulsing]);

  return (
    <div
      id={`cmd-${command.id}`}
      role="option"
      aria-selected={isSelected}
      ref={isSelected ? itemRef : null}
      className={pulsing ? 'anim-pop' : undefined}
      onClick={() => {
        setPulsing(true);
        onExecute();
      }}
      onMouseEnter={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
        border: isSelected ? '1px solid var(--border-accent)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.1s ease'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1px solid var(--border-subtle)'
        }}
      >
        {command.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isSelected ? 'var(--cyan)' : 'var(--text-main)'
            }}
          >
            {command.title}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              background: 'var(--bg-surface-elevated)',
              padding: '0.1rem 0.4rem',
              borderRadius: '3px'
            }}
          >
            {command.category}
          </span>
        </div>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '0.15rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {command.desc}
        </p>
      </div>
      <ArrowRight
        size={14}
        color={isSelected ? 'var(--cyan)' : 'var(--text-dim)'}
        style={{
          opacity: isSelected ? 1 : 0.4,
          transform: isSelected ? 'translateX(3px)' : 'none',
          transition: 'all 0.15s ease'
        }}
      />
    </div>
  );
}
