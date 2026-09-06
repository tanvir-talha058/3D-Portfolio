import React from 'react';

/**
 * Shimmering placeholder shown while the lazily-loaded Playground chunk
 * arrives, so the slot reads as "loading" instead of as a gap in the page.
 */
export default function SectionSkeleton({ minHeight = '400px' }) {
  return (
    <div className="container" style={{ minHeight, padding: '3.5rem 1.5rem' }} aria-hidden="true">
      <div
        className="skeleton-block"
        style={{ height: '18px', width: '180px', margin: '0 auto 1.25rem', borderRadius: '999px' }}
      />
      <div
        className="skeleton-block"
        style={{ height: '38px', width: 'min(460px, 80%)', margin: '0 auto 2.5rem' }}
      />
      <div
        className="skeleton-block"
        style={{ height: '260px', borderRadius: 'var(--radius-lg)' }}
      />
    </div>
  );
}
