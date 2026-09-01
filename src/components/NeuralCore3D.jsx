import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d } from 'lucide-react';

export default function NeuralCore3D({ isLightMode }) {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth > 0 ? container.clientWidth : 380;
    const height = container.clientHeight > 0 ? container.clientHeight : 420;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 19;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    
    // Clear and append
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Inner Tensor Core Icosahedron Wireframe
    const icoGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: isLightMode ? 0x2563eb : 0x38bdf8,
      transparent: true,
      opacity: isLightMode ? 0.35 : 0.45
    });
    const innerCore = new THREE.Mesh(icoGeo, icoMat);
    rootGroup.add(innerCore);

    // 2. High-Density 3D Vector Embedding Point Cloud (1,200 points)
    const particleCount = 1200;
    const posArray = new Float32Array(particleCount * 3);
    const origPosArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const primaryColor = isLightMode ? new THREE.Color(0x2563eb) : new THREE.Color(0x38bdf8);
    const secondaryColor = isLightMode ? new THREE.Color(0x4f46e5) : new THREE.Color(0x818cf8);
    const accentColor = isLightMode ? new THREE.Color(0x059669) : new THREE.Color(0x34d399);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 6.2 + (Math.random() - 0.5) * 1.5;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;

      origPosArray[i * 3] = x;
      origPosArray[i * 3 + 1] = y;
      origPosArray[i * 3 + 2] = z;

      const mixedColor = Math.random() > 0.65 
        ? accentColor 
        : (Math.random() > 0.3 ? primaryColor : secondaryColor);

      colorArray[i * 3] = mixedColor.r;
      colorArray[i * 3 + 1] = mixedColor.g;
      colorArray[i * 3 + 2] = mixedColor.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Crisp circular canvas particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const pctx = canvas.getContext('2d');
    const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pctx.fillStyle = grad;
    pctx.beginPath();
    pctx.arc(16, 16, 16, 0, Math.PI * 2);
    pctx.fill();
    const pointTexture = new THREE.CanvasTexture(canvas);

    const particlesMat = new THREE.PointsMaterial({
      size: isLightMode ? 0.32 : 0.38,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: isLightMode ? 0.85 : 0.95,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false
    });

    const pointCloud = new THREE.Points(particlesGeo, particlesMat);
    rootGroup.add(pointCloud);

    // 3. Orbiting Holographic Rings (Torus rings)
    const ringGeo = new THREE.TorusGeometry(8.2, 0.05, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isLightMode ? 0x2563eb : 0x38bdf8,
      transparent: true,
      opacity: isLightMode ? 0.3 : 0.45
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    rootGroup.add(ring2);

    // Mouse Interaction Physics (Rotation & Momentum)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const startTime = performance.now();

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;

        previousMousePosition = { x: clientX, y: clientY };
      } else {
        const rect = container.getBoundingClientRect();
        mouseX = ((clientX - rect.left) / (rect.width || 1)) * 2 - 1;
        mouseY = -(((clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;

      // Continuous ambient rotation + inertia
      if (!isDragging) {
        targetRotationY += 0.003;
        targetRotationX = Math.sin(time * 0.5) * 0.2 + mouseY * 0.3;
      }

      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.06;

      // Inner Core Counter-Rotation
      innerCore.rotation.x -= 0.005;
      innerCore.rotation.z += 0.004;

      // Rings Rotation
      ring1.rotation.z += 0.007;
      ring2.rotation.z -= 0.005;

      // Harmonic wave in point cloud vertices
      const pos = particlesGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const ox = origPosArray[i * 3];
        const oy = origPosArray[i * 3 + 1];
        const oz = origPosArray[i * 3 + 2];

        const wave = Math.sin(time * 2 + ox * 0.4 + oy * 0.4) * 0.25;
        pos[i * 3] = ox * (1 + wave * 0.06);
        pos[i * 3 + 1] = oy * (1 + wave * 0.06);
        pos[i * 3 + 2] = oz * (1 + wave * 0.06);
      }
      particlesGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth > 0 ? container.clientWidth : 380;
      const newHeight = container.clientHeight > 0 ? container.clientHeight : 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
    };
  }, [isLightMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* 3D Canvas Mount */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: isInteracting ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none'
        }}
      />

      {/* Floating 3D Control HUD Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.3rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          backdropFilter: 'blur(10px)',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-dim)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Rotate3d size={13} color="var(--cyan)" />
        <span>3D AI Embedding Sphere • Drag to Rotate 360°</span>
      </div>
    </div>
  );
}
