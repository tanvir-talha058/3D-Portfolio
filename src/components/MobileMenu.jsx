import React, { useEffect, useRef } from 'react';
import { Command, Eye } from 'lucide-react';

/**
 * The slide-down mobile nav drawer. Traps Tab focus while open (Escape and
 * outside-click are handled by the parent Navbar, which owns `isOpen`) and
 * returns focus to the toggle button that opened it once it closes.
 */
export default function MobileMenu({
  isOpen,
  navLinks,
  activeSection,
  isLightMode,
  playBeep,
  onClose,
  onOpenCommandCenter,
  onOpenResume,
  returnFocusRef
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    // Lock body scroll while the drawer is open — otherwise the page behind
    // it (which has no backdrop covering it below the panel's own height)
    // keeps scrolling and its buttons stay clickable through the gap.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const panel = panelRef.current;
    if (!panel) return undefined;
    const triggerEl = returnFocusRef?.current;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll('a[href], button:not([disabled])'));

    getFocusable()[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', handleKeyDown);
    return () => {
      panel.removeEventListener('keydown', handleKeyDown);
      triggerEl?.focus();
    };
  }, [isOpen, returnFocusRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full-viewport scrim behind the drawer — without it, the page
          below the panel's own (content-sized) height stays visible and
          clickable, which is broken for a modal-style nav drawer. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          // `bottom: 0` would resolve against <nav>'s own (nav-height-tall)
          // box, not the viewport — its backdrop-filter makes it the
          // containing block for fixed descendants. An explicit vh-based
          // height sidesteps that.
          height: 'calc(100vh - var(--nav-height))',
          background: isLightMode ? 'rgba(15, 23, 42, 0.35)' : 'rgba(3, 4, 8, 0.6)',
          zIndex: 98
        }}
      />
      <div
        id="mobile-menu"
        className="mobile-menu-panel"
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          width: '100%',
          maxHeight: 'calc(100vh - var(--nav-height))',
          overflowY: 'auto',
          background: isLightMode ? '#ffffff' : '#080a0f',
          borderBottom: '1px solid var(--border-medium)',
          padding: '1.25rem 1.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          backdropFilter: 'blur(24px)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 99
        }}
      >
        {/* Quick Command Center in Mobile */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenCommandCenter();
        }}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}
      >
        <Command size={15} />
        <span>Open AI Command Hub (⌘K)</span>
      </button>

      {navLinks.map((link, idx) => (
        <a
          key={link.id}
          href={link.href}
          onClick={() => {
            playBeep(640);
            onClose();
          }}
          className="anim-right"
          style={{
            animationDelay: `${0.05 + idx * 0.04}s`,
            animationDuration: '0.4s',
            fontSize: '1rem',
            fontWeight: '600',
            color: activeSection === link.id ? 'var(--cyan)' : 'var(--text-main)',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{link.label}</span>
          {activeSection === link.id && (
            <span style={{ color: 'var(--cyan)', fontSize: '0.8rem' }}>● Active</span>
          )}
        </a>
      ))}

      {/* Quick Action CTAs in Mobile Drawer */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenResume();
          }}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Eye size={15} />
          <span>View PDF Resume</span>
        </button>
      </div>
      </div>
    </>
  );
}
