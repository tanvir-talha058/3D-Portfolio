import React, { useEffect, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer
} from 'three';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const CORPUS_COUNT = 220;

// Deterministic PRNG so the corpus cloud looks identical on every load
// rather than reshuffling each time the tab is opened.
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * The retrieval step of the RAG pipeline, drawn in the embedding space it
 * actually happens in: a corpus cloud, the query vector, and the top-k
 * neighbours it pulls back with their similarity links.
 *
 * `phase` drives the visual state — 'idle' (drifting corpus), 'searching'
 * (query vector injected, pulsing), 'retrieved' (neighbours lit, links
 * drawn). Drag (mouse or touch) to orbit.
 */
export default function RagRetrievalScene({ phase = 'idle', docs = [] }) {
  const mountRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Latest props for the animation loop to read without tearing down the
  // scene every time a token streams in.
  const stateRef = useRef({ phase, docs });

  useEffect(() => {
    stateRef.current = { phase, docs };
  }, [phase, docs]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth > 0 ? container.clientWidth : 600;
    const height = container.clientHeight > 0 ? container.clientHeight : 320;

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 14);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    const group = new Group();
    scene.add(group);

    const disposables = [];

    // --- Corpus cloud ------------------------------------------------------
    const rand = seededRandom(20260905);
    const positions = new Float32Array(CORPUS_COUNT * 3);
    for (let i = 0; i < CORPUS_COUNT; i++) {
      // Two loose clusters so it reads as a real embedding space rather than
      // uniform noise.
      const cluster = rand() > 0.45 ? 1 : -1;
      const radius = 4 + rand() * 4.5;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius + cluster * 2.4;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.7;
      positions[i * 3 + 2] = Math.cos(phi) * radius;
    }
    const corpusGeo = new BufferGeometry();
    corpusGeo.setAttribute('position', new BufferAttribute(positions, 3));
    const corpusMat = new PointsMaterial({
      size: 0.14,
      color: 0x64748b,
      transparent: true,
      opacity: 0.7
    });
    group.add(new Points(corpusGeo, corpusMat));
    disposables.push(corpusGeo, corpusMat);

    // --- Query vector ------------------------------------------------------
    const queryGeo = new SphereGeometry(0.7, 20, 20);
    const queryMat = new MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
    const queryNode = new Mesh(queryGeo, queryMat);
    queryNode.position.set(0, 0, 0);
    group.add(queryNode);
    disposables.push(queryGeo, queryMat);

    // --- Retrieved neighbours + their similarity links ---------------------
    // Fixed slots, revealed as results come in, so positions stay stable.
    const NEIGHBOUR_SLOTS = 4;
    const neighbours = [];
    for (let i = 0; i < NEIGHBOUR_SLOTS; i++) {
      const angle = (i / NEIGHBOUR_SLOTS) * Math.PI * 2 + 0.4;
      const dist = 6.4 + i * 1.1;
      const target = new Vector3(
        Math.cos(angle) * dist,
        Math.sin(angle * 1.3) * 3.4,
        Math.sin(angle) * dist * 0.55
      );

      const geo = new SphereGeometry(0.55, 18, 18);
      const mat = new MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0 });
      const mesh = new Mesh(geo, mat);
      mesh.position.copy(target);
      group.add(mesh);

      const lineGeo = new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), target]);
      const lineMat = new LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
      const line = new Line(lineGeo, lineMat);
      group.add(line);

      disposables.push(geo, mat, lineGeo, lineMat);
      neighbours.push({ mesh, mat, lineMat, target });
    }

    // --- Orbit interaction (mouse + touch) ---------------------------------
    let isDragging = false;
    let prev = { x: 0, y: 0 };
    let rotX = 0.15;
    let rotY = 0;

    const pointerXY = (e) => ({
      x: e.clientX ?? e.touches?.[0]?.clientX ?? 0,
      y: e.clientY ?? e.touches?.[0]?.clientY ?? 0
    });

    const onPointerDown = (e) => {
      isDragging = true;
      prev = pointerXY(e);
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const { x, y } = pointerXY(e);
      rotY += (x - prev.x) * 0.007;
      rotX += (y - prev.y) * 0.007;
      rotX = Math.max(-1.1, Math.min(1.1, rotX));
      prev = { x, y };
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // --- Render loop -------------------------------------------------------
    let animId = null;
    let elapsed = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      elapsed += 0.016;

      if (!isDragging && !prefersReducedMotion) rotY += 0.0022;
      group.rotation.y = rotY;
      group.rotation.x = rotX;

      const { phase: livePhase, docs: liveDocs } = stateRef.current;
      const searching = livePhase === 'searching';
      const retrieved = livePhase === 'retrieved';

      // Query node fades in while searching, then holds with a soft pulse.
      const queryTarget = searching || retrieved ? 1 : 0;
      queryMat.opacity += (queryTarget - queryMat.opacity) * 0.08;
      const pulse = searching ? 1 + Math.sin(elapsed * 6) * 0.25 : 1;
      queryNode.scale.setScalar(pulse);

      neighbours.forEach((n, i) => {
        // Reveal a neighbour once its result exists; brightness tracks score.
        const doc = liveDocs[i];
        const active = retrieved && doc;
        const targetOpacity = active ? 0.35 + (doc.score ?? 0.8) * 0.65 : 0;
        n.mat.opacity += (targetOpacity - n.mat.opacity) * 0.07;
        n.lineMat.opacity += ((active ? 0.55 : 0) - n.lineMat.opacity) * 0.07;
        const s = active ? 1 + Math.sin(elapsed * 3 + i) * 0.06 : 0.6;
        n.mesh.scale.setScalar(s);
      });

      renderer.render(scene, camera);
    };

    // Pause while off-screen or backgrounded, matching VectorSpace3D.
    let inViewport = true;
    const syncLoop = () => {
      const shouldRun = inViewport && !document.hidden;
      if (shouldRun && animId === null) animate();
      else if (!shouldRun && animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              inViewport = entry.isIntersecting;
              syncLoop();
            },
            { threshold: 0 }
          );
    observer?.observe(container);
    document.addEventListener('visibilitychange', syncLoop);

    animate();

    const onResize = () => {
      const w = container.clientWidth > 0 ? container.clientWidth : 600;
      const h = container.clientHeight > 0 ? container.clientHeight : 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={mountRef}
      className="rag-scene"
      role="img"
      aria-label="3D visualisation of the query vector retrieving its nearest documents in embedding space"
      style={{
        width: '100%',
        height: 'clamp(240px, 38vw, 340px)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--terminal-bg)',
        overflow: 'hidden',
        cursor: 'grab',
        touchAction: 'pan-y'
      }}
    />
  );
}
