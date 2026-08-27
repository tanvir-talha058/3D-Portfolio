'use client';

/**
 * The latent field: the hero's signature element.
 *
 * Points are not decorative noise — they are a projected embedding space.
 * 70% of them belong to one of six clusters, each anchored to a real domain
 * in the work; the rest are background scatter. Distance from a cluster
 * centroid drives the magma ramp, so tight cores read hot and the diffuse
 * edges read cold. Hovering a domain ignites exactly its cluster.
 *
 * A refractive glass core floats in front, bending the field behind it.
 */

import { useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend, type ThreeEvent } from '@react-three/fiber';
import { Html, Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { domains } from '../data';

const COUNT = 3400;
const CLUSTER_RATIO = 0.7;
const SIGMA = 0.42;

/* --------------------------- point material --------------------------- */

const vertexShader = /* glsl */ `
  attribute float aRamp;
  attribute float aCluster;
  attribute float aSeed;
  attribute float aScale;

  uniform float uTime;
  uniform float uHotIndex;
  uniform float uSize;
  uniform float uDpr;
  uniform float uIntro;
  uniform float uMaxSize;

  varying float vRamp;
  varying float vHot;
  varying float vFade;

  void main() {
    vec3 p = position;

    // Slow per-point drift so the cloud breathes instead of sitting still.
    float t = uTime * 0.25 + aSeed * 6.2831;
    p += vec3(sin(t), cos(t * 0.9), sin(t * 1.3)) * 0.035;

    // Intro: points converge from a wider shell into their cluster.
    p = mix(p * 2.4, p, uIntro);

    vHot = (abs(aCluster - uHotIndex) < 0.5) ? 1.0 : 0.0;
    vRamp = aRamp;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // Depth fade keeps the far side of the cloud from muddying the front.
    vFade = smoothstep(-6.0, 1.5, mv.z);

    gl_Position = projectionMatrix * mv;
    float size = uSize * aScale * (1.0 + vHot * 0.85) * (1.0 / -mv.z);
    gl_PointSize = min(size, uMaxSize) * uDpr;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;

  varying float vRamp;
  varying float vHot;
  varying float vFade;

  uniform float uOpacity;

  // Magma ramp — the same five stops the rest of the page is built from.
  vec3 ramp(float t) {
    vec3 c0 = vec3(0.125, 0.102, 0.267);
    vec3 c1 = vec3(0.329, 0.259, 0.710);
    vec3 c2 = vec3(0.553, 0.482, 0.949);
    vec3 c3 = vec3(0.435, 0.839, 0.933);
    vec3 c4 = vec3(0.616, 0.953, 0.886);

    t = clamp(t, 0.0, 1.0);
    if (t < 0.25) return mix(c0, c1, t / 0.25);
    if (t < 0.50) return mix(c1, c2, (t - 0.25) / 0.25);
    if (t < 0.75) return mix(c2, c3, (t - 0.50) / 0.25);
    return mix(c3, c4, (t - 0.75) / 0.25);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // Soft core with a falloff halo, so points read as light not squares.
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 1.35);

    vec3 col = ramp(vRamp + vHot * 0.35);
    col += vHot * 0.28;

    gl_FragColor = vec4(col, alpha * uOpacity * mix(0.5, 1.0, vFade));
  }
`;

class PointMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uHotIndex: { value: -1 },
        uSize: { value: 78 },
        uDpr: { value: 1 },
        uOpacity: { value: 0.95 },
        uIntro: { value: 0 },
        uMaxSize: { value: 12 },
      },
    });
  }
}

extend({ PointMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    pointMaterial: import('@react-three/fiber').MaterialNode<PointMaterial, typeof PointMaterial>;
  }
}

/* ------------------------------ geometry ------------------------------ */

function useFieldGeometry() {
  return useMemo(() => {
    const position = new Float32Array(COUNT * 3);
    const aRamp = new Float32Array(COUNT);
    const aCluster = new Float32Array(COUNT);
    const aSeed = new Float32Array(COUNT);
    const aScale = new Float32Array(COUNT);

    // Box-Muller: real gaussian scatter, so clusters have honest density.
    const gauss = () => {
      const u = Math.random() || 1e-6;
      const v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };

    for (let i = 0; i < COUNT; i++) {
      const clustered = i < COUNT * CLUSTER_RATIO;
      let x: number, y: number, z: number, ramp: number, cluster: number;

      if (clustered) {
        cluster = Math.floor(Math.random() * domains.length);
        const c = domains[cluster].pos;
        const dx = gauss() * SIGMA;
        const dy = gauss() * SIGMA;
        const dz = gauss() * SIGMA;
        x = c[0] + dx;
        y = c[1] + dy;
        z = c[2] + dz;
        // Tight to the centroid = hot end of the ramp.
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        ramp = 1 - Math.min(dist / (SIGMA * 2.6), 1);
        ramp = 0.35 + ramp * 0.65;
      } else {
        cluster = -1;
        const r = 1.6 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        ramp = Math.random() * 0.28;
      }

      position[i * 3] = x;
      position[i * 3 + 1] = y;
      position[i * 3 + 2] = z;
      aRamp[i] = ramp;
      aCluster[i] = cluster;
      aSeed[i] = Math.random();
      aScale[i] = 0.55 + Math.random() * (clustered ? 0.85 : 0.4);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(position, 3));
    g.setAttribute('aRamp', new THREE.BufferAttribute(aRamp, 1));
    g.setAttribute('aCluster', new THREE.BufferAttribute(aCluster, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
    g.setAttribute('aScale', new THREE.BufferAttribute(aScale, 1));
    return g;
  }, []);
}

/* ------------------------------- pieces ------------------------------- */

function Points({ hot, reduced }: { hot: number; reduced: boolean }) {
  const geometry = useFieldGeometry();
  const mat = useRef<PointMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    m.uniforms.uDpr.value = dpr;
    m.uniforms.uHotIndex.value = hot;
    m.uniforms.uIntro.value = THREE.MathUtils.damp(
      m.uniforms.uIntro.value,
      1,
      1.6,
      Math.min(delta, 0.1),
    );

    const scrolled = typeof window !== 'undefined' ? window.scrollY : 0;
    const p = Math.min(scrolled / 900, 1);
    const eased = p * p * (3 - 2 * p);
    m.uniforms.uOpacity.value = 0.95 * (1 - eased * 0.8);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointMaterial ref={mat} />
    </points>
  );
}

/**
 * The glass core. MeshTransmissionMaterial does real refraction, so the
 * point field genuinely bends through it rather than being faked with alpha.
 */
function GlassCore({ quality, at }: { quality: 'high' | 'low'; at: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const edges = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.14;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.16;
  });

  return (
    // Nudged clear of the copy column: at the widest layout the core would
    // otherwise sit on the last word of the headline.
    <group ref={ref} scale={0.74} position={at}>
      {/* Faceted, not smooth. A subdivided sphere needs a bright environment
          to read as glass at all; twenty flat faces each catch their own
          highlight, so the core still reads as a cut lens on a near-black
          page — and a crystal over an embedding space is the more honest
          object anyway. */}
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        {quality === 'high' ? (
        <MeshTransmissionMaterial
          samples={8}
          resolution={320}
          transmission={1}
          /* Thin and lightly aberrated. The heavier settings read as a smoked
             marble against a near-black page rather than as glass, and they
             muddy the very field the core is supposed to be bending. */
          thickness={0.34}
          roughness={0.04}
          ior={1.36}
          chromaticAberration={0.06}
          /* No distortion terms. Through a sphere they smear the refracted
             lightformers into horizontal bands, which reads as a rendering
             artefact rather than as glass. */
          anisotropy={0}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          clearcoat={1}
          clearcoatRoughness={0.03}
          attenuationDistance={2.2}
          attenuationColor="#e6f6ff"
          color="#ffffff"
        />
        ) : (
          <meshPhysicalMaterial
            transmission={0.92}
            thickness={0.6}
            roughness={0.12}
            ior={1.4}
            flatShading
            clearcoat={1}
            transparent
          />
        )}
      </mesh>

      {/* The cut lines. They give the facets an edge to read against when
          the refraction behind them is dark. */}
      <lineSegments>
        <edgesGeometry args={[edges]} />
        <lineBasicMaterial color="#9df3e2" transparent opacity={0.28} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

function Anchor({
  index,
  hot,
  gateX,
  labelled,
  onHover,
}: {
  index: number;
  hot: boolean;
  gateX: number;
  labelled: boolean;
  onHover: (i: number) => void;
}) {
  const d = domains[index];
  const ref = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLSpanElement>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const camera = useThree((s) => s.camera);
  const world = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hot ? 1.9 : 1;
    const s = THREE.MathUtils.damp(ref.current.scale.x, target, 8, Math.min(delta, 0.1));
    ref.current.scale.setScalar(s);

    // A label is only legible once its node has orbited clear of the copy
    // column, so gate it on projected screen position rather than letting it
    // sit on top of the headline. The copy is centred, so the gate is on
    // distance from the centre line, not on x itself.
    ref.current.getWorldPosition(world);
    world.project(camera);
    const clear = THREE.MathUtils.smoothstep(Math.abs(world.x), gateX, gateX + 0.22);

    if (label.current) label.current.style.opacity = String(hot ? 1 : clear * 0.62);

    // The node itself dims too, so it never reads as a stray dot sitting on
    // top of the headline. It stays hoverable either way.
    if (matRef.current) matRef.current.opacity = hot ? 1 : 0.06 + clear * 0.94;
  });

  const go = useCallback(() => {
    document.querySelector(d.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [d.href]);

  return (
    <group position={d.pos}>
      <mesh
        ref={ref}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(index);
        }}
        onPointerOut={() => onHover(-1)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          go();
        }}
      >
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial
          ref={matRef}
          color={d.colour}
          emissive={d.colour}
          emissiveIntensity={hot ? 3.2 : 1.6}
          roughness={0.25}
          toneMapped={false}
          transparent
        />
      </mesh>

      {labelled && (
        <Html center distanceFactor={9} zIndexRange={[20, 0]}>
          <span ref={label} className="node-label" data-hot={hot}>
            {d.label}
          </span>
        </Html>
      )}
    </group>
  );
}

/** Pointer parallax + scroll dolly, both damped so nothing snaps. */
function Rig({ reduced, hot, offsetX }: { reduced: boolean; hot: number; offsetX: number }) {
  const { camera, pointer } = useThree();
  const scroll = useRef(0);
  const aim = offsetX * 0.42;

  useFrame((_, delta) => {
    if (reduced) {
      camera.position.set(aim, 0, 7.2);
      camera.lookAt(aim, 0, 0);
      return;
    }

    scroll.current = typeof window !== 'undefined' ? window.scrollY : 0;
    const d = Math.min(delta, 0.1);

    // Fly through the field rather than backing away from it: the camera
    // drives forward past the glass core, so the cloud opens around the
    // viewer as the hero scrolls out.
    const progress = Math.min(scroll.current / 900, 1);
    const eased = progress * progress * (3 - 2 * progress); // smoothstep

    const targetZ = 7.2 - eased * 8.6 + (hot >= 0 ? -0.5 : 0);
    const targetY = pointer.y * 0.85 + eased * 0.9;
    const targetX = aim + pointer.x * 1.15 - eased * aim * 0.75;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.4, d);
    camera.lookAt(aim - eased * aim * 0.6, 0, 0);
  });

  return null;
}

/* ------------------------------- scene -------------------------------- */

function Scene({ reduced, quality }: { reduced: boolean; quality: 'high' | 'low' }) {
  const [hot, setHot] = useState(-1);
  const group = useRef<THREE.Group>(null);
  const width = useThree((s) => s.size.width);

  // The copy is centred, so the field is too: an offset cloud behind
  // centred text reads as a mistake rather than as a second column.
  const offsetX = 0;
  const scale = width >= 860 ? 1 : 0.82;

  // The refractive solid muddies whatever it sits behind, and centred copy
  // owns the middle. Wide layouts have margins, so it sits in the right one;
  // narrow layouts have none, so it drops below the text instead.
  const corePos: [number, number, number] =
    width >= 1180 ? [3.1, -1.5, 0] : width >= 860 ? [2.4, -1.8, 0] : [0.55, -2.5, 0];

  // Half-width of the copy column in NDC: a label is legible once its node
  // has orbited outside that, on either side.
  const gateX = width >= 1180 ? 0.5 : 0.64;

  // Narrow layouts put the copy across the full width, so there is nowhere
  // for a label to sit and they were gated permanently invisible. Invisible
  // is not free: drei renders each one into a div that still takes part in
  // layout, and at 320px those were 430-650px wide and pushing the page
  // into horizontal scroll. Below the two-column breakpoint they are simply
  // not rendered.
  const labelled = width >= 860;

  useFrame((state, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.045;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
  });

  return (
    <>
      {/* Few, very large, and deliberately low resolution. Flat facets each
          refract the whole environment, so small bright panels arrive as
          hard-edged bars — a broad soft field is what reads as glass. */}
      <Environment resolution={64}>
        <Lightformer intensity={3.4} position={[0, 6, 4]} scale={[22, 12, 1]} color="#eaf3ff" />
        <Lightformer intensity={2.2} position={[-8, -1, 3]} scale={[14, 16, 1]} color="#9db4ff" />
        <Lightformer intensity={2.4} position={[8, -2, 2]} scale={[14, 16, 1]} color="#7fe3f0" />
      </Environment>

      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />

      <group position={[offsetX, 0, 0]} scale={scale}>
        <group ref={group}>
          <Points hot={hot} reduced={reduced} />
          {domains.map((_, i) => (
            <Anchor
              key={domains[i].id}
              index={i}
              hot={hot === i}
              gateX={gateX}
              labelled={labelled}
              onHover={setHot}
            />
          ))}
          </group>

        <GlassCore quality={quality} at={corePos} />
      </group>

      <Rig reduced={reduced} hot={hot} offsetX={offsetX} />
    </>
  );
}

export default function Field({
  reduced,
  quality,
  active,
}: {
  reduced: boolean;
  quality: 'high' | 'low';
  active: boolean;
}) {
  return (
    <Canvas
      className="field"
      // Kept mounted but frozen when off screen: tearing down the WebGL
      // context and rebuilding it on scroll-back costs far more than idling.
      frameloop={active ? 'always' : 'never'}
      dpr={[1, quality === 'high' ? 2 : 1.35]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      // The scene lives behind the copy; it must never eat clicks except on
      // the anchors, which re-enable pointer events themselves.
      style={{ pointerEvents: 'auto' }}
    >
      <Scene reduced={reduced} quality={quality} />
    </Canvas>
  );
}
