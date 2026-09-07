import React from 'react';

/**
 * One "icon + label + value" row on the Contact page — the shape shared by
 * the email, WhatsApp, LinkedIn and GitHub cards. Render as a plain `div`
 * (email, which has an inner mailto link plus a separate copy button passed
 * via `action`) or as `a` (the fully-clickable social cards, optionally with
 * `hoverAccent` wiring up the shared `.hover-slide-accent` CSS class).
 */
export default function ContactMethodCard({
  as: Tag = 'div',
  icon,
  iconBg,
  iconColor,
  label,
  value,
  action,
  hoverAccent,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <Tag
      className={`glass-card ${hoverAccent ? 'hover-slide-accent' : ''} ${className}`.trim()}
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        ...(hoverAccent ? { '--hover-accent': hoverAccent } : {}),
        ...style
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-sm)',
            background: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              color: 'var(--text-dim)'
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              wordBreak: 'break-word'
            }}
          >
            {value}
          </div>
        </div>
      </div>
      {action}
    </Tag>
  );
}
