'use client';

/**
 * The retrieval pipeline, in space.
 *
 * Not an illustration of a RAG system — a working diagram of one. A query
 * packet is emitted, travels the corpus, condenses into an embedding,
 * lands in the vector store, pulls the nearest neighbours back out, is
 * fused inside the model block, and leaves as a grounded answer. The
 * stages are real stages; the geometry carries the meaning.
 *
 * Hovering a stage holds it and pauses the packet on it.
 */

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, Environment, Lightformer, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export type Stage = {
  key: string;
  label: string;
  note: string;
  /** x position on the pipeline axis */
  x: number;
};

export const STAGES: Stage[] = [
  { key: 'corpus', label: 'Corpus', note: 'Policy docs, manuals, tickets — chunked and cleaned.', x: -5.1 },
  { key: 'embed', label: 'Embed', note: 'Every chunk becomes a vector. So does the question.', x: -2.55 },
  { key: 'store', label: 'Vector store', note: 'Dense + BM25 side by side, indexed for recall.', x: 0 },
  { key: 'rerank', label: 'Retrieve & rerank', note: 'Top-k pulled, reordered by a cross-encoder.', x: 2.55 },
  { key: 'model', label: 'Model', note: 'Context fused with the question under hard constraints.', x: 5.1 },
];

/**
 * Where a stage sits. Wide viewports read the pipeline left to right.
 * Narrow ones read it top to bottom: five stages cannot fit across a phone
 * without shrinking past legibility, and a pipeline is a sequence either
 * way — the axis is a layout choice, not part of the meaning.
 */
function place(i: number, vertical: boolean): [number, number, number] {
  return vertical ? [-0.85, -STAGES[i].x * 0.74, 0] : [STAGES[i].x, 0, 0];
}

const COLD = new THREE.Color('#5442b5');
const WARM = new THREE.Color('#8d7bf2');
const HOT = new THREE.Color('#9df3e2');
const CYAN = new THREE.Color('#6fd6ee');

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/* ------------------------------- corpus ------------------------------- */

/** A drift of documents: thin lit planes, stacked with real depth. */
function Corpus({ heat, pos }: { heat: number; pos: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);

  const sheets = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 0.9,
          (i - 5) * 0.17 + (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.9,
        ] as [number, number, number],
        rot: (Math.random() - 0.5) * 0.5,
        seed: Math.random() * 6.28,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.16;
    group.current.children.forEach((child, i) => {
      child.position.y = (i - 5) * 0.17 + Math.sin(t * 0.7 + sheets[i].seed) * 0.035;
    });
  });

  return (
    <group ref={group} position={pos}>
      {sheets.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[-Math.PI / 2, 0, s.rot]}>
          <planeGeometry args={[0.86, 1.1]} />
          <meshStandardMaterial
            color="#cfd8f0"
            emissive={CYAN}
            emissiveIntensity={0.05 + heat * 0.35}
            transparent
            opacity={0.16 + heat * 0.2}
            side={THREE.DoubleSide}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------ embedding ----------------------------- */

/** Documents collapse into a single vector: a converging cone of points. */
function Embed({ heat, pos }: { heat: number; pos: [number, number, number] }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      const u = i / n;
      const r = (1 - u) * 0.85 + 0.03;
      const a = u * 34 + Math.random() * 0.4;
      pos[i * 3] = (u - 0.5) * 1.5;
      pos[i * 3 + 1] = Math.cos(a) * r;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (points.current) points.current.rotation.x = state.clock.elapsedTime * 0.5;
  });

  return (
    <points ref={points} geometry={geometry} position={pos}>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color={WARM.clone().lerp(HOT, heat)}
        transparent
        opacity={0.5 + heat * 0.5}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/* ---------------------------- vector store ---------------------------- */

/**
 * The index as a lattice: a cube of vectors where the neighbours of the
 * query light up. This is the part people picture wrongly — it is not a
 * database of text, it is a space with distances in it.
 */
function Store({ heat, t, pos }: { heat: number; t: number; pos: [number, number, number] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colour = useMemo(() => new THREE.Color(), []);

  const cells = useMemo(() => {
    const out: { p: THREE.Vector3; d: number }[] = [];
    const n = 5;
    for (let x = 0; x < n; x += 1)
      for (let y = 0; y < n; y += 1)
        for (let z = 0; z < n; z += 1) {
          const p = new THREE.Vector3((x - 2) * 0.3, (y - 2) * 0.3, (z - 2) * 0.3);
          out.push({ p, d: p.length() });
        }
    return out;
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.24;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.18;
    }
    if (!mesh.current) return;

    // A recall wavefront expands from the centre: the k nearest light first.
    const front = ((t * 0.55) % 1) * 1.3;
    cells.forEach((c, i) => {
      const near = clamp01(1 - Math.abs(c.d - front) * 3.2);
      const lit = near * (0.35 + heat * 0.65);
      dummy.position.copy(c.p);
      const s = 0.05 + lit * 0.075;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      colour.copy(COLD).lerp(HOT, lit);
      mesh.current!.setColorAt(i, colour);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={group} position={pos}>
      <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {/* the index's shell, so the space reads as bounded */}
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshBasicMaterial
          color={CYAN}
          wireframe
          transparent
          opacity={0.06 + heat * 0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------- rerank ------------------------------- */

/** Top-k passages, pulled out and reordered — the tallest scores first. */
function Rerank({
  heat,
  t,
  pos,
  vertical,
}: {
  heat: number;
  t: number;
  pos: [number, number, number];
  vertical: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const bars = useMemo(() => [0.95, 0.72, 0.58, 0.4, 0.28], []);

  useFrame(() => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const pulse = 0.85 + Math.sin(t * 1.4 - i * 0.5) * 0.15;
      child.scale.y = bars[i] * pulse * (0.7 + heat * 0.5);
    });
  });

  return (
    <group ref={group} position={[pos[0], pos[1] - (vertical ? 0.3 : 0.55), pos[2]]}>
      {bars.map((b, i) => (
        <mesh key={i} position={[(i - 2) * 0.26, b / 2, 0]}>
          <boxGeometry args={[0.16, 1, 0.16]} />
          <meshStandardMaterial
            color={i === 0 ? HOT : COLD.clone().lerp(WARM, 1 - i / 5)}
            emissive={i === 0 ? HOT : WARM}
            emissiveIntensity={i === 0 ? 0.6 + heat : 0.15 + heat * 0.3}
            roughness={0.35}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------- model ------------------------------- */

/**
 * The model block. Deliberately a solid object rather than a cloud: at
 * this point in the pipeline it is a fixed thing you send context into,
 * with attention layers stacked inside it.
 */
function Model({ heat, t, pos }: { heat: number; t: number; pos: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const layers = useRef<THREE.Group>(null);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.35) * 0.4 + 0.5;
      // Float around where the stage sits, not around the origin — stacked
      // vertically, an absolute y drags the block onto the vector store.
      group.current.position.y = pos[1] + Math.sin(t * 0.8) * 0.04;
    }
    if (layers.current) {
      layers.current.children.forEach((child, i) => {
        const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = 0.2 + Math.max(0, Math.sin(t * 2.2 - i * 0.7)) * (0.6 + heat);
      });
    }
  });

  return (
    <group ref={group} position={pos}>
      <RoundedBox args={[1.15, 1.45, 1.15]} radius={0.09} smoothness={4}>
        {/* Glass, not a box: the layers inside are the point, so the
            shell has to be something you can see through. */}
        <meshPhysicalMaterial
          color="#8fb6ff"
          metalness={0}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.82}
          thickness={1.1}
          ior={1.42}
          transparent
          opacity={0.92}
          envMapIntensity={2.2}
        />
      </RoundedBox>
      <group ref={layers}>
        {[-0.42, -0.14, 0.14, 0.42].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.78, 0.11, 0.78]} />
            <meshStandardMaterial
              color="#141c3a"
              emissive={i === 3 ? HOT : CYAN}
              emissiveIntensity={0.5}
              toneMapped={false}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        ))}
      </group>
      {/* Edge cage: transmission alone disappears against empty space. */}
      <mesh>
        <boxGeometry args={[1.17, 1.47, 1.17]} />
        <meshBasicMaterial
          color={CYAN}
          wireframe
          transparent
          opacity={0.18 + heat * 0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ----------------------------- the packet ----------------------------- */

/** One question, travelling the whole pipeline. */
function Packet({ t, held, vertical }: { t: number; held: number | null; vertical: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const trail = useRef<THREE.Mesh>(null);
  const from = STAGES[0].x - 1.2;
  const to = STAGES[4].x + 1.6;

  useFrame(() => {
    if (!mesh.current) return;
    // Held on a stage while that stage is hovered; otherwise a slow loop.
    const u = held !== null ? (STAGES[held].x - from) / (to - from) : (t * 0.13) % 1;
    const along = from + (to - from) * u;
    const wobble = Math.sin(u * Math.PI * 2) * 0.12;

    // Along the axis, wobbling across it — whichever way the axis runs.
    const x = vertical ? -0.85 + wobble : along;
    const y = vertical ? -along * 0.74 : wobble;
    mesh.current.position.set(x, y, 0);

    const s = 0.1 + Math.sin(t * 4) * 0.012;
    mesh.current.scale.setScalar(s);
    if (trail.current) {
      trail.current.position.set(vertical ? x : x - 0.5, vertical ? y + 0.5 : y, 0);
      const m = trail.current.material as THREE.MeshBasicMaterial;
      m.opacity = held !== null ? 0.06 : 0.18;
    }
  });

  return (
    <group>
      <mesh ref={trail} rotation={[0, 0, vertical ? 0 : Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.09, 1, 8]} />
        <meshBasicMaterial color={HOT} transparent opacity={0.18} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#e8fffb" toneMapped={false} />
      </mesh>
      <pointLight color={HOT} intensity={2.5} distance={3} />
    </group>
  );
}

/* -------------------------------- rail -------------------------------- */

function Rail({ vertical }: { vertical: boolean }) {
  const geometry = useMemo(() => {
    const a = STAGES[0].x - 1.3;
    const b = STAGES[4].x + 1.7;
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        vertical
          ? [-0.85, -a * 0.74, 0, -0.85, -b * 0.74, 0]
          : [a, 0, 0, b, 0, 0],
        3,
      ),
    );
    return g;
  }, [vertical]);
  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#9db4ff" transparent opacity={0.16} toneMapped={false} />
    </line>
  );
}

/* -------------------------------- scene -------------------------------- */

/**
 * Exported so the shared world can mount it as a station. `rig` is false
 * there: in the world exactly one camera rig is in charge, and this scene
 * would otherwise reset the camera to its own framing every frame.
 */
export function Scene({
  reduced,
  hovered,
  setHovered,
  rig = true,
}: {
  reduced: boolean;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  rig?: boolean;
}) {
  const clock = useRef(0);
  const [, force] = useState(0);
  const frame = useRef(0);
  const width = useThree((st) => st.size.width);
  const aspect = useThree((st) => st.size.width / st.size.height);
  const vertical = width < 780;

  useFrame((state, delta) => {
    if (!reduced) clock.current += Math.min(delta, 0.05);
    // The Html labels only need to follow the hover state, not every frame.
    frame.current += 1;
    if (frame.current % 30 === 0) force((n) => n + 1);

    // In the world the camera belongs to the world's rig.
    if (!rig) return;

    if (vertical) {
      // A tall stack fills a portrait frame: hold it centred and still.
      //
      // fov is vertical, so what fits the five stages top to bottom is the
      // camera distance alone. Deriving that distance from the aspect
      // ratio meant a shorter frame pulled the camera *in* and cropped the
      // first and last stage; the floor is the distance that actually
      // holds the whole stack, and the aspect term only pushes further
      // back when the frame is narrow enough to need it.
      state.camera.position.set(0, 0, Math.max(13.6, 8.6 / Math.min(aspect, 1)));
      state.camera.lookAt(0, 0, 0);
    } else {
      // fov is vertical, so a narrow window needs the camera further back.
      const fit = Math.max(1, 1.55 / aspect);
      state.camera.position.x = Math.sin(clock.current * 0.12) * 0.6;
      state.camera.position.y = 1.35 + Math.sin(clock.current * 0.17) * 0.15;
      state.camera.position.z = 8.4 * fit;
      state.camera.lookAt(0, 0, 0);
    }
  });

  const t = clock.current;
  const heat = (i: number) => (hovered === null ? 0.35 : hovered === i ? 1 : 0.12);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} color="#dce8ff" />
      <directionalLight position={[-6, -2, 3]} intensity={0.4} color="#8d7bf2" />

      <Rail vertical={vertical} />
      <Corpus heat={heat(0)} pos={place(0, vertical)} />
      <Embed heat={heat(1)} pos={place(1, vertical)} />
      <Store heat={heat(2)} t={t} pos={place(2, vertical)} />
      <Rerank heat={heat(3)} t={t} pos={place(3, vertical)} vertical={vertical} />
      <Model heat={heat(4)} t={t} pos={place(4, vertical)} />
      <Packet t={t} held={hovered} vertical={vertical} />

      {/* Hit targets and labels. The label is DOM, so it stays readable
          and selectable rather than being baked into the canvas. */}
      {STAGES.map((s, i) => (
        <group key={s.key} position={place(i, vertical)}>
          <mesh
            visible={false}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setHovered(i);
            }}
            onPointerOut={() => setHovered(null)}
          >
            <boxGeometry args={[2.1, 2.4, 2.1]} />
          </mesh>
          {/* No distanceFactor: with one, each label scales by its depth,
              so five labels on one axis land at five sizes and baselines.
              Screen-space keeps the type identical and crisp. */}
          <Html
            position={vertical ? [1.15, 0.1, 0] : [0, -1.32, 0]}
            center={!vertical}
            zIndexRange={[10, 0]}
          >
            <div className="rag-label" data-hot={hovered === i}>
              <span className="mono rag-label-i">{String(i + 1).padStart(2, '0')}</span>
              {s.label}
            </div>
          </Html>
        </group>
      ))}

      <Environment resolution={192}>
        <Lightformer intensity={2.4} position={[0, 5, 3]} scale={[16, 8, 1]} color="#eaf3ff" />
        <Lightformer intensity={2} position={[-8, 0, 3]} scale={[10, 12, 1]} color="#7d78ee" />
        <Lightformer intensity={2.2} position={[8, -1, 2]} scale={[10, 12, 1]} color="#6fd6ee" />
      </Environment>
    </>
  );
}

export default function Rag({ reduced = false }: { reduced?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 1.35, 8.4], fov: 40 }}
    >
      <Scene reduced={reduced} hovered={hovered} setHovered={setHovered} />
    </Canvas>
  );
}
