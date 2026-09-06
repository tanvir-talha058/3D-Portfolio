import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const REVEAL_DURATION = 640;

export default function SpotlightCard({
  children,
  className = '',
  style = {},
  onClick,
  reveal = false,
  revealDelay = 0
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const prefersReducedMotion = usePrefersReducedMotion();
  const [inViewRef, inView] = useInView({ threshold: 0.12 });
  const revealActive = reveal && !prefersReducedMotion;

  // Once the entrance has played out we hand the transform back to the
  // pointer tilt, which needs a much shorter transition to feel responsive.
  const [settled, setSettled] = useState(!reveal);

  useEffect(() => {
    if (!revealActive || !inView || settled) return undefined;
    const timer = setTimeout(() => setSettled(true), revealDelay + REVEAL_DURATION);
    return () => clearTimeout(timer);
  }, [revealActive, inView, settled, revealDelay]);

  const setRefs = useCallback(
    (node) => {
      cardRef.current = node;
      inViewRef.current = node;
    },
    [inViewRef]
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, opacity: 1 });

    // Calculate subtle 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
    setTilt({ x: 0, y: 0 });
  };

  const hidden = revealActive && !inView;
  const tiltTransform = `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;

  return (
    <div
      ref={setRefs}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-card spotlight-card ${className}`}
      style={{
        ...style,
        position: 'relative',
        opacity: hidden ? 0 : 1,
        transform: hidden
          ? 'perspective(1000px) translate3d(0, 28px, 0) scale(0.97)'
          : tiltTransform,
        transition: settled
          ? 'transform 0.15s ease-out, box-shadow 0.25s ease, border-color 0.25s ease'
          : `opacity ${REVEAL_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${revealDelay}ms, transform ${REVEAL_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${revealDelay}ms, box-shadow 0.25s ease, border-color 0.25s ease`,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* Dynamic Radial Spotlight Glow Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          opacity: mousePos.opacity,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, var(--cyan-glow), transparent 65%)`,
          zIndex: 0
        }}
      />

      {/* Card content. preserve-3d here too, otherwise this wrapper would
          flatten the .depth-* layers its children opt into. */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
    </div>
  );
}
