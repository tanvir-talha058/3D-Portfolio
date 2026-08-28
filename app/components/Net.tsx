'use client';

/**
 * A live feedforward network for the expertise section.
 *
 * This is a real diagram, not an ornament: four layers, fully connected,
 * with a signal wave that propagates left to right. Each layer lights as the
 * wave front reaches it, and the edge shader brightens along the same front,
 * so what you watch is genuinely forward propagation rather than a loop of
 * unrelated glimmers. Layer labels come from the section's own legend.
 */

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { netLayers } from '../data';

const LAYER_SIZES = [5, 8, 8, 3];
const SPAN_X = 7.2;
const SPAN_Y = 2.9;
const MAX_SPREAD = 3.3;
const WAVE_PERIOD = 3.6;

/** Node positions, laid out layer by layer and centred vertically. */
function useTopology() {
  return useMemo(() => {
    const nodes: { pos: THREE.Vector3; layer: number }[] = [];

    LAYER_SIZES.forEach((count, layer) => {
      const x = -SPAN_X / 2 + (layer / (LAYER_SIZES.length - 1)) * SPAN_X;
      for (let i = 0; i < count; i++) {
        const spread = SPAN_Y * ((count / 8) * 0.65 + 0.45);
        const y = count === 1 ? 0 : (i / (count - 1) - 0.5) * spread;
        nodes.push({ pos: new THREE.Vector3(x, y, 0), layer });
      }
    });

    // Fully connect consecutive layers.
    const edges: { a: THREE.Vector3; b: THREE.Vector3; la: number; lb: number }[] = [];
    for (let l = 0; l < LAYER_SIZES.length - 1; l++) {
      const from = nodes.filter((n) => n.layer === l);
      const to = nodes.filter((n) => n.layer === l + 1);
      from.forEach((f) => to.forEach((t) => edges.push({ a: f.pos, b: t.pos, la: l, lb: l + 1 })));
    }

    return { nodes, edges };
  }, []);
}

/* ------------------------------- edges -------------------------------- */

const edgeVert = /* glsl */ `
  attribute float aLayer;
  varying float vLayer;
  varying float vT;

  void main() {
    vLayer = aLayer;
    // 0..1 along the network's width, used to place the wave front.
    vT = (position.x + ${(SPAN_X / 2).toFixed(3)}) / ${SPAN_X.toFixed(3)};
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const edgeFrag = /* glsl */ `
  precision mediump float;
  varying float vLayer;
  varying float vT;
  uniform float uWave;
  uniform float uOpacity;

  void main() {
    // Gaussian pulse centred on the travelling wave front.
    float d = vT - uWave;
    float pulse = exp(-(d * d) / 0.012);

    vec3 cold = vec3(0.329, 0.259, 0.710);
    vec3 hot  = vec3(0.616, 0.953, 0.886);
    vec3 col = mix(cold, hot, pulse);

    float alpha = (0.13 + pulse * 0.72) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

class EdgeMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: edgeVert,
      fragmentShader: edgeFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uWave: { value: 0 },
        uOpacity: { value: 1 },
      },
    });
  }
}

extend({ EdgeMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    edgeMaterial: import('@react-three/fiber').MaterialNode<EdgeMaterial, typeof EdgeMaterial>;
  }
}

function Edges({ wave }: { wave: React.MutableRefObject<number> }) {
  const { edges } = useTopology();
  const mat = useRef<EdgeMaterial>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(edges.length * 6);
    const layer = new Float32Array(edges.length * 2);
    edges.forEach((e, i) => {
      pos.set([e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z], i * 6);
      layer[i * 2] = e.la;
      layer[i * 2 + 1] = e.lb;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aLayer', new THREE.BufferAttribute(layer, 1));
    return g;
  }, [edges]);

  useFrame(() => {
    if (mat.current) mat.current.uniforms.uWave.value = wave.current;
  });

  return (
    <lineSegments geometry={geometry}>
      <edgeMaterial ref={mat} />
    </lineSegments>
  );
}

/* -------------------------------- nodes -------------------------------- */

const COLD = new THREE.Color('#5442b5');
const HOT = new THREE.Color('#9df3e2');

function Nodes({ wave }: { wave: React.MutableRefObject<number> }) {
  const { nodes } = useTopology();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colour = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;

    nodes.forEach((n, i) => {
      const t = (n.pos.x + SPAN_X / 2) / SPAN_X;
      const d = t - wave.current;
      const pulse = Math.exp(-(d * d) / 0.01);

      dummy.position.copy(n.pos);
      dummy.scale.setScalar(1 + pulse * 1.35);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      colour.copy(COLD).lerp(HOT, pulse);
      m.setColorAt(i, colour);
    });

    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]}>
      <sphereGeometry args={[0.075, 20, 20]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/* -------------------------------- scene -------------------------------- */

/** Exported so the shared world can mount it as a station. */
export function Scene({ reduced }: { reduced: boolean }) {
  const wave = useRef(reduced ? 0.5 : 0);
  const group = useRef<THREE.Group>(null);
  const { pointer, size } = useThree();

  // Fit to the frame: derive the visible extent at z=0 from the camera, then
  // scale so the network fills it with a consistent margin at any aspect.
  const scale = useMemo(() => {
    const halfH = Math.tan((45 * Math.PI) / 360) * 5.4;
    const halfW = halfH * (size.width / Math.max(size.height, 1));
    return Math.min((halfW * 2) / (SPAN_X * 1.12), (halfH * 2) / (MAX_SPREAD * 1.3));
  }, [size.width, size.height]);

  useFrame((state, delta) => {
    if (!reduced) {
      wave.current = (state.clock.elapsedTime % WAVE_PERIOD) / WAVE_PERIOD;
    }
    if (!group.current) return;

    const d = Math.min(delta, 0.1);
    const ty = reduced ? 0 : pointer.x * 0.28;
    const tx = reduced ? 0 : -pointer.y * 0.18;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ty, 4, d);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tx, 4, d);
  });

  return (
    <group ref={group} scale={scale}>
      <Edges wave={wave} />
      <Nodes wave={wave} />
    </group>
  );
}

export default function Net({ reduced, active }: { reduced: boolean; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      style={{ pointerEvents: 'none' }}
    >
      <Scene reduced={reduced} />
    </Canvas>
  );
}

export { netLayers };
