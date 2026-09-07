import React from 'react';

const SIZE_STYLES = {
  xs: { padding: '0.2rem 0.65rem', fontSize: '0.75rem', gap: '0.4rem' },
  sm: { padding: '0.3rem 0.8rem', fontSize: '0.8rem', gap: '0.45rem' },
  md: { padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.45rem' }
};

/**
 * Small rounded chip used throughout the site for status/role/tech pills.
 * Only the structural shape (flex, radius, sizing) is shared — background,
 * border and color vary per call site and are supplied via `style`, since
 * those genuinely differ (theme-aware, data-driven, or conditional colors).
 */
export default function PillBadge({
  icon,
  children,
  size = 'sm',
  mono = false,
  as: Tag = 'div',
  className = '',
  style = {},
  ...rest
}) {
  return (
    <Tag
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--radius-full)',
        ...SIZE_STYLES[size],
        ...(mono ? { fontFamily: 'var(--font-mono)' } : {}),
        ...style
      }}
      {...rest}
    >
      {icon}
      {children}
    </Tag>
  );
}
