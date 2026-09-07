import React, { useEffect, useRef, useState } from 'react';
import {
  BufferGeometry,
  GridHelper,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';
import { Rotate3d } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const EMBEDDING_POINTS = [
  // Bangla Banking Cluster (Cyan)
  {
    label: 'upay Add Money (বিকাশ/কার্ড)',
    cluster: 'FinTech Intent',
    color: 0x38bdf8,
    pos: [-3.5, 2.0, 1.5]
  },
  {
    label: 'Merchant Payment QR (পেমেন্ট)',
    cluster: 'FinTech Intent',
    color: 0x38bdf8,
    pos: [-2.8, 3.2, 0.8]
  },
  {
    label: 'Bill Pay DESCO & DPDC',
    cluster: 'FinTech Intent',
    color: 0x38bdf8,
    pos: [-4.2, 1.5, 2.2]
  },
  {
    label: 'Mobile Recharge (গ্রামীনফোন)',
    cluster: 'FinTech Intent',
    color: 0x38bdf8,
    pos: [-3.0, 1.8, -1.0]
  },

  // NLP / Transformer Core Cluster (Violet)
  { label: 'Bangla-BERT Base', cluster: 'NLP Models', color: 0x818cf8, pos: [3.2, 1.8, 2.5] },
  {
    label: 'Multilingual RoBERTa (XLM-R)',
    cluster: 'NLP Models',
    color: 0x818cf8,
    pos: [4.0, 2.5, 1.2]
  },
  { label: 'Cross-Encoder Reranker', cluster: 'NLP Models', color: 0x818cf8, pos: [2.5, 3.5, 3.0] },
  {
    label: 'Qdrant Hybrid Vector Index',
    cluster: 'NLP Models',
    color: 0x818cf8,
    pos: [3.8, 0.8, 2.0]
  },

  // Computer Vision & Security Cluster (Emerald)
  {
    label: 'YOLOv8 Real-time Detection',
    cluster: 'Vision AI',
    color: 0x34d399,
    pos: [1.0, -3.5, -2.0]
  },
  {
    label: 'MediaPipe 21 Hand Landmarks',
    cluster: 'Vision AI',
    color: 0x34d399,
    pos: [0.2, -4.2, -1.2]
  },
  {
    label: 'CNN Crop Leaf Classifier',
    cluster: 'Vision AI',
    color: 0x34d399,
    pos: [2.2, -3.0, -3.2]
  },
  {
    label: 'Deepfake Spectral Artifacts',
    cluster: 'Vision AI',
    color: 0x34d399,
    pos: [-1.2, -3.8, -2.5]
  },

  // FinTech Risk & Anomaly Cluster (Amber / Rose)
  {
    label: 'Isolation Forest Anomaly',
    cluster: 'Fraud Engine',
    color: 0xf59e0b,
    pos: [-2.5, -1.5, 3.5]
  },
  {
    label: 'Hourly Velocity Deviation',
    cluster: 'Fraud Engine',
    color: 0xf59e0b,
    pos: [-1.8, -2.2, 4.2]
  },
  {
    label: 'IMEI Fingerprint Change',
    cluster: 'Fraud Engine',
    color: 0xf43f5e,
    pos: [-3.2, -0.8, 4.0]
  },
  {
    label: 'ISO8583 Gateway Validation',
    cluster: 'Fraud Engine',
    color: 0xf59e0b,
    pos: [-1.0, -1.0, 3.0]
  }
];

export default function VectorSpace3D() {
  const mountRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth > 0 ? container.clientWidth : 600;
    const height = 400;

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const group = new Group();
    scene.add(group);

    // Coordinate Grid GridHelper
    const grid = new GridHelper(14, 14, 0x38bdf8, 0x1e293b);
    grid.position.y = -5;
    group.add(grid);

    // Draw Vector Nodes as Spheres & Glow
    const nodeMeshes = [];
    const disposables = [];
    EMBEDDING_POINTS.forEach((pt, index) => {
      const geo = new SphereGeometry(0.35, 16, 16);
      const mat = new MeshBasicMaterial({ color: pt.color });
      const mesh = new Mesh(geo, mat);
      mesh.position.set(...pt.pos);
      mesh.userData = { ...pt, index };
      group.add(mesh);
      nodeMeshes.push(mesh);
      disposables.push(geo, mat);

      // Connecting lines to cluster center
      const lineGeo = new BufferGeometry().setFromPoints([
        new Vector3(...pt.pos),
        new Vector3(pt.pos[0] * 0.2, pt.pos[1] * 0.2, pt.pos[2] * 0.2)
      ]);
      const lineMat = new LineBasicMaterial({
        color: pt.color,
        transparent: true,
        opacity: 0.25
      });
      const line = new Line(lineGeo, lineMat);
      group.add(line);
      disposables.push(lineGeo, lineMat);
    });

    // Raycaster for mouse hovering
    const raycaster = new Raycaster();
    const mouse = new Vector2(-100, -100);

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0;
    let rotY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      const cx = e.clientX || (e.touches && e.touches[0].clientX);
      const cy = e.clientY || (e.touches && e.touches[0].clientY);
      prevMouse = { x: cx, y: cy };
    };

    const onPointerMove = (e) => {
      const cx = e.clientX || (e.touches && e.touches[0].clientX);
      const cy = e.clientY || (e.touches && e.touches[0].clientY);

      if (isDragging) {
        rotY += (cx - prevMouse.x) * 0.008;
        rotX += (cy - prevMouse.y) * 0.008;
        prevMouse = { x: cx, y: cy };
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((cy - rect.top) / rect.height) * 2 - 1);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let animId = null;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging && !prefersReducedMotion) {
        rotY += 0.002;
      }

      group.rotation.y = rotY;
      group.rotation.x = rotX;

      // Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const target = intersects[0].object.userData;
        setHoveredNode(target);
      }

      renderer.render(scene, camera);
    };

    // Pause the render loop while the canvas is scrolled out of view or the
    // tab is backgrounded — cheap to resume, no state is lost. `inViewport`
    // is the single source of truth both listeners read/write so they never
    // fight over restarting the loop.
    let inViewport = true;
    const syncLoop = () => {
      const shouldRun = inViewport && !document.hidden;
      if (shouldRun && animId === null) {
        animate();
      } else if (!shouldRun && animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    // Environments without IntersectionObserver (very old browsers, jsdom in
    // tests) just skip the off-screen pause — the tab-visibility pause below
    // still applies.
    const visibilityObserver =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              inViewport = entry.isIntersecting;
              syncLoop();
            },
            { threshold: 0 }
          );
    visibilityObserver?.observe(container);

    document.addEventListener('visibilitychange', syncLoop);

    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth > 0 ? container.clientWidth : 600;
      camera.aspect = nw / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, 400);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      grid.geometry.dispose();
      grid.material.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Rotate3d size={18} color="var(--cyan)" />
            <span>3D Multidimensional Semantic Vector Space</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Interactive 3D WebGL projection of 768-dim SentenceTransformer vector embeddings in
            reduced 3D PCA coordinate space.
          </p>
        </div>

        {hoveredNode && (
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-accent)',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span style={{ color: 'var(--cyan)' }}>[{hoveredNode.cluster}]</span>{' '}
            <strong style={{ color: 'var(--text-main)' }}>{hoveredNode.label}</strong>
          </div>
        )}
      </div>

      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '400px',
          background: 'var(--terminal-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-medium)',
          cursor: 'grab',
          position: 'relative',
          overflow: 'hidden'
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <span>
          • Drag with mouse/touch to rotate 3D cluster • Hover over nodes to inspect semantic
          embeddings
        </span>
        <span style={{ color: '#059669' }}>Cosine Metric: Normalized L2</span>
      </div>
    </div>
  );
}
