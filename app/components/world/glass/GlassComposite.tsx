'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlassMaterial } from './glassMaterial';
import { createRegistry } from './paneRegistry';

/**
 * Owns the frame.
 *
 * A useFrame with a non-zero priority turns off R3F's automatic render, which
 * means this component is now responsible for drawing the scene at all. That
 * is a real obligation: every early return below still renders the world, and
 * the failure path unmounts the component so R3F takes its render back. A
 * refraction bug must never be able to blank the page.
 *
 * CameraRig stays at priority 0, so it has already moved the camera by the
 * time we draw.
 */

type Props = { onFail: () => void };

/** The station tint, read from the CSS custom property that already drives
    every pane's fill, so the shader cannot disagree with the stylesheet. */
function readTint(target: THREE.Color) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--glass-tint')
    .trim();
  if (!raw) return;
  try {
    target.set(raw);
  } catch {
    /* Mid-transition the property can read as a non-parsable interpolation.
       Keeping the previous colour for a frame is invisible. */
  }
}

export default function GlassComposite({ onFail }: Props) {
  const { gl, scene, camera, size, viewport } = useThree();
  const failed = useRef(false);
  const frames = useRef(0);

  const material = useMemo(() => createGlassMaterial(), []);
  const registry = useMemo(() => createRegistry(), []);

  const quad = useMemo(() => {
    const s = new THREE.Scene();
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    m.frustumCulled = false;
    s.add(m);
    return { scene: s, camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [material]);

  const target = useMemo(
    () =>
      new THREE.WebGLRenderTarget(1, 1, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        stencilBuffer: false,
      }),
    [],
  );

  /* WebGL1 has no GLSL3, no texture() and no const array initialisers. Rather
     than keep a second shader for it, we decline: the page already looks
     right without refraction. */
  useEffect(() => {
    if (!gl.capabilities.isWebGL2) {
      failed.current = true;
      onFail();
    }
  }, [gl, onFail]);

  useEffect(() => {
    const w = Math.max(1, Math.floor(size.width * viewport.dpr));
    const h = Math.max(1, Math.floor(size.height * viewport.dpr));
    target.setSize(w, h);
    material.uniforms.uRes.value.set(w, h);
    /* Below the page's own breakpoint a full rim is most of a small pane, so
       it would read as a smear rather than an edge. */
    const small = size.width < 900;
    material.uniforms.uRimScale.value = small ? 0.6 : 1;
    material.uniforms.uDispScale.value = small ? 0.5 : 1;
  }, [size, viewport.dpr, target, material]);

  /* The tint changes on the root's data-frame, which WorldMount writes. */
  useEffect(() => {
    const tint = material.uniforms.uTint.value as THREE.Color;
    readTint(tint);
    let timer: ReturnType<typeof setInterval> | null = null;
    const mo = new MutationObserver(() => {
      /* The CSS transition on --glass-tint runs 1.4s, so sample across it
         rather than once at the start. */
      if (timer) clearInterval(timer);
      let n = 0;
      timer = setInterval(() => {
        readTint(tint);
        n += 1;
        if (n > 28 && timer) clearInterval(timer);
      }, 50);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-frame'] });
    return () => {
      mo.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [material]);

  useEffect(
    () => () => {
      registry.dispose();
      target.dispose();
      material.dispose();
      quad.scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    },
    [registry, target, material, quad],
  );

  useFrame((_, dt) => {
    if (failed.current) return;

    let count = 0;
    if (process.env.NODE_ENV !== 'production') frames.current += 1;
    try {
      count = registry.update(Math.min(dt, 0.1), viewport.dpr);
    } catch {
      failed.current = true;
      onFail();
      return;
    }

    /* No glass on screen: the composite would be a fullscreen pass that
       changes nothing. Draw the world straight out instead. */
    /* Development only, and on the documentElement rather than on window,
       because that is the one channel every automation harness can read:
       page globals are invisible to a driver that evaluates in an isolated
       world, but the DOM is shared. Reads "<frames>:<panes>", so a stalled
       layer, an idle one and a working one are three different answers
       rather than one silence. */
    if (process.env.NODE_ENV !== 'production') {
      document.documentElement.dataset.glass = frames.current + ':' + count;
    }

    if (count === 0) {
      gl.setRenderTarget(null);
      gl.render(scene, camera);
      return;
    }

    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    material.uniforms.tWorld.value = target.texture;
    material.uniforms.uCount.value = count;
    (material.uniforms.uRect.value as Float32Array).set(registry.rects);
    (material.uniforms.uParam.value as Float32Array).set(registry.params);
    material.uniformsNeedUpdate = true;

    gl.clear();
    gl.render(quad.scene, quad.camera);
  }, 1);

  return null;
}
