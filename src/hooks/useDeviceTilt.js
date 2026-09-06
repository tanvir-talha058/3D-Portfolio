import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const clamp = (value, max) => Math.max(-max, Math.min(max, value));

/**
 * Tilt angles derived from the device's gyroscope, so the pointer-driven 3D
 * tilt elsewhere on the site has a touch-device equivalent (there is no
 * hover on a phone). Angles are relative to however the device is being
 * held when the first reading arrives, so a natural resting angle reads as
 * neutral rather than permanently tilted.
 *
 * Returns `{ x, y }` in degrees, `{ x: 0, y: 0 }` on desktop, under
 * prefers-reduced-motion, or when no sensor/permission is available.
 *
 * iOS 13+ gates the sensor behind a permission prompt that must follow a
 * user gesture, so the request is deferred to the visitor's first tap.
 */
export function useDeviceTilt({ maxDeg = 10, sensitivity = 0.6 } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (typeof window.DeviceOrientationEvent === 'undefined') return undefined;
    // Desktops report no meaningful orientation; keep the mouse path there.
    if (window.matchMedia('(pointer: fine)').matches) return undefined;

    let baseline = null;
    let frame = null;
    let pending = null;
    let cancelled = false;

    const apply = () => {
      frame = null;
      if (pending) setTilt(pending);
    };

    const handleOrientation = (e) => {
      if (e.beta == null || e.gamma == null) return;
      if (!baseline) baseline = { beta: e.beta, gamma: e.gamma };

      // beta = front/back lean (drives rotateX), gamma = left/right roll.
      pending = {
        x: clamp((e.beta - baseline.beta) * sensitivity, maxDeg) * -1,
        y: clamp((e.gamma - baseline.gamma) * sensitivity, maxDeg)
      };
      // Coalesce the ~60Hz sensor stream into one state update per frame.
      if (frame == null) frame = window.requestAnimationFrame(apply);
    };

    const start = () => {
      if (cancelled) return;
      window.addEventListener('deviceorientation', handleOrientation);
    };

    const needsPermission = typeof window.DeviceOrientationEvent.requestPermission === 'function';

    let requestOnGesture = null;
    if (needsPermission) {
      requestOnGesture = () => {
        window.DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') start();
          })
          .catch(() => {
            /* Declined or unavailable — the site just stays untilted. */
          });
      };
      window.addEventListener('touchend', requestOnGesture, { once: true });
    } else {
      start();
    }

    return () => {
      cancelled = true;
      window.removeEventListener('deviceorientation', handleOrientation);
      if (requestOnGesture) window.removeEventListener('touchend', requestOnGesture);
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, maxDeg, sensitivity]);

  return tilt;
}
