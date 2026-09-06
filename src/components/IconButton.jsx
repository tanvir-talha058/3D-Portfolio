import React, { forwardRef } from 'react';

/**
 * Small square/circular icon-only button — the shape shared by every modal
 * close button and the navbar's mobile menu toggle. Position, color and
 * other one-off overrides are supplied via `style`. Forwards its ref to the
 * underlying <button> so callers can restore focus to it (e.g. the mobile
 * menu returning focus to this toggle when it closes).
 */
const IconButton = forwardRef(function IconButton(
  { icon, size = 36, shape = 'circle', className = '', style = {}, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: shape === 'circle' ? '50%' : 'var(--radius-md)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        ...style
      }}
      {...rest}
    >
      {icon}
    </button>
  );
});

export default IconButton;
