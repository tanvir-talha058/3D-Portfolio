'use client';

/**
 * The boot sequence: the portfolio arrives inside a laptop.
 *
 * A machined aluminium notebook sits closed in the dark. The lid lifts,
 * the panel wakes, a short honest boot log types itself out, and the
 * camera dollies through the screen into the site. The whole thing is
 * modelled — no image of a laptop, no video: RoundedBox geometry, a
 * physical brushed-metal material, and a canvas texture for the panel,
 * so it stays crisp at any viewport and recolours with the palette.
 *
 * Plays once per session, never under prefers-reduced-motion, and is
 * skippable from the first frame.
 */

import { useMemo, useRef, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Environment, Lightformer, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/* ---------------------------------------------------------------------
   Timeline. One shared clock in seconds so every stage is legible here
   rather than scattered through the frame loop.
   --------------------------------------------------------------------- */
const T = {
  settle: 0.35, // laptop drifts in, closed
  lidOpen: 0.55, // hinge starts
  lidDone: 2.25,
  wake: 1.5, // panel backlight
  logStart: 1.85,
  logEnd: 3.9,
  dolly: 4.05, // camera pushes into the panel
  through: 5.35, // camera is inside the glass
  end: 5.9,
};

const BOOT_LINES = [
  '> mounting latent field ............ ok',
  '> loading retrieval index .......... ok',
  '> warming language weights ......... ok',
  '> attaching risk stream ............ ok',
  '> compositing surfaces ............. ok',
];

/* The panel texture is a fixed 1280x800 however large the screen it is
   drawn on. On a phone that panel lands at roughly 250 css px wide, where
   the lines above render at about five pixels — present, but unreadable.
   The compact set is the same log with the leaders shortened so the type
   can be set nearly twice as large in the same space. */
const BOOT_LINES_COMPACT = [
  '> latent field ..... ok',
  '> retrieval index .. ok',
  '> language weights . ok',
  '> risk stream ...... ok',
  '> surfaces ......... ok',
];

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Progress through a window of the timeline, eased. */
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/* --------------------------- the panel ---------------------------- */

/**
 * The screen is a 2D canvas painted every frame and uploaded as a
 * texture. Cheaper than DOM-in-3D, and it lets the boot log use the
 * same mono voice as the rest of the page.
 */
/** Soft radial falloff, used additively for the light the panel throws. */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.45, 'rgba(255,255,255,0.28)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function usePanelTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { canvas, ctx, texture };
  }, []);
}

function paintPanel(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  wake: number,
  compact: boolean,
) {
  const lines = compact ? BOOT_LINES_COMPACT : BOOT_LINES;
  const k = compact ? 1.6 : 1; // type scale for a small panel
  ctx.clearRect(0, 0, w, h);

  // Deep panel ground with a cool vignette — the void, lit from within.
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.42, 40, w * 0.5, h * 0.5, w * 0.75);
  bg.addColorStop(0, '#0d1226');
  bg.addColorStop(1, '#05060d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Backlight bloom as the panel wakes.
  if (wake > 0) {
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.62);
    glow.addColorStop(0, `rgba(111, 214, 238, ${0.16 * wake})`);
    glow.addColorStop(1, 'rgba(111, 214, 238, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  // Scanline grid: structure, and it sells the panel as a display.
  ctx.strokeStyle = `rgba(190, 215, 255, ${0.05 * wake})`;
  ctx.lineWidth = 1;
  for (let y = 0; y < h; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }

  if (wake < 0.05) return;
  ctx.globalAlpha = wake;

  const padX = compact ? 84 : 132;

  // Window chrome bar, so the panel reads as a running machine.
  ctx.fillStyle = 'rgba(190, 215, 255, 0.09)';
  ctx.fillRect(padX, 96, w - padX * 2, 2);
  ctx.font = `500 ${Math.round(24 * k)}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
  ctx.fillStyle = '#666f8a';
  ctx.fillText('tanvir.dev — boot', padX, 76);

  // How far the identity card has arrived. A full-size panel has room for
  // the log and the card at once; a compact one does not, so there the log
  // clears as the name lands rather than being overprinted by it.
  const card = span(t, T.logEnd - 0.35, T.logEnd + 0.5);
  const logFade = compact ? 1 - card : 1;

  // Boot log, typed line by line.
  const logT = clamp01((t - T.logStart) / (T.logEnd - T.logStart));
  const shown = logT * lines.length;
  const lead = Math.round(46 * k);
  ctx.font = `400 ${Math.round(27 * k)}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
  for (let i = 0; i < lines.length; i += 1) {
    const local = clamp01(shown - i);
    if (local <= 0) continue;
    const line = lines[i];
    const chars = Math.floor(line.length * Math.min(1, local * 1.6));
    const text = line.slice(0, chars);
    // The trailing "ok" lands on the hot end of the ramp; the rest is quiet.
    ctx.globalAlpha = wake * logFade;
    ctx.fillStyle = text.endsWith('ok') ? '#9df3e2' : '#8f9ab5';
    ctx.fillText(text, padX, 190 + i * lead);
  }
  ctx.globalAlpha = wake;

  // Cursor block, blinking on a half-second beat.
  if (logT < 1 && Math.floor(t * 2) % 2 === 0) {
    const i = Math.min(lines.length - 1, Math.floor(shown));
    const line = lines[i] ?? '';
    const chars = Math.floor(line.length * Math.min(1, clamp01(shown - i) * 1.6));
    const width = ctx.measureText(line.slice(0, chars)).width;
    ctx.fillStyle = '#6fd6ee';
    ctx.fillRect(padX + width + 6, 168 + i * lead, Math.round(14 * k), Math.round(30 * k));
  }

  // Identity card, after the log completes.
  if (card > 0) {
    ctx.globalAlpha = wake * card;
    const cardY = compact ? 300 : 470;
    ctx.fillStyle = 'rgba(190, 215, 255, 0.12)';
    ctx.fillRect(padX, cardY, w - padX * 2, 1);

    ctx.font = `500 ${Math.round(88 * (compact ? 1.35 : 1))}px Fraunces, Georgia, ui-serif, serif`;
    ctx.fillStyle = '#edeff5';
    ctx.fillText('Tanvir Ahmed', padX, cardY + (compact ? 132 : 126));

    ctx.font = `500 ${Math.round(26 * k)}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
    ctx.fillStyle = '#6fd6ee';
    ctx.fillText('A I   /   M L   E N G I N E E R', padX, cardY + (compact ? 190 : 180));
  }

  ctx.globalAlpha = 1;
}

/* ---------------------------- the machine ---------------------------- */

function Laptop({ clock }: { clock: React.MutableRefObject<number> }) {
  const lid = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const bloom = useRef<THREE.Mesh>(null);
  const { canvas, ctx, texture } = usePanelTexture();
  const glow = useGlowTexture();

  // Brushed aluminium, cool-tinted so it belongs to the abyss palette.
  const shell = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#171b2c',
        metalness: 0.92,
        roughness: 0.32,
        clearcoat: 0.6,
        clearcoatRoughness: 0.28,
        envMapIntensity: 1.5,
      }),
    [],
  );

  const deck = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#141a30',
        metalness: 0.7,
        roughness: 0.5,
        envMapIntensity: 1.1,
      }),
    [],
  );

  // Key field: one instanced mesh, laid out on a real keyboard grid.
  const keys = useMemo(() => {
    const out: [number, number, number][] = [];
    const cols = 14;
    const rows = 5;
    const kw = 0.145;
    const gap = 0.028;
    const totalW = cols * kw + (cols - 1) * gap;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        out.push([
          -totalW / 2 + kw / 2 + c * (kw + gap),
          0.11,
          -0.5 + r * (kw + gap + 0.012),
        ]);
      }
    }
    return out;
  }, []);

  useFrame((state) => {
    const t = clock.current;
    const compact = state.size.width < 700;

    // Lid: hinged at the back edge. Closed is +90 degrees — lying forward
    // over the keyboard — and it eases back to just past vertical.
    const open = easeInOut(span(t, T.lidOpen, T.lidDone));
    if (lid.current) lid.current.rotation.x = Math.PI / 2 - open * (Math.PI / 2 + 0.3);

    // The machine drifts in and turns a few degrees, then squares up as
    // the camera commits to the screen.
    if (body.current) {
      const settle = easeOut(span(t, 0, T.settle + 1.2));
      const square = easeInOut(span(t, T.dolly - 0.5, T.dolly + 0.4));
      const drift = Math.sin(state.clock.elapsedTime * 0.35) * 0.045 * (1 - square);
      body.current.rotation.y = (0.42 - 0.42 * square) * settle + drift;
      body.current.rotation.x = 0.07 * (1 - square) * settle;
      body.current.position.y = -0.55 + 0.55 * settle;
    }

    // Panel: paint, wake, then blow out to white as the camera passes through.
    const wake = easeOut(span(t, T.wake, T.wake + 0.7));
    paintPanel(ctx, canvas.width, canvas.height, t, wake, compact);
    texture.needsUpdate = true;

    if (screen.current) {
      const blowout = easeInOut(span(t, T.through - 0.55, T.through + 0.15));
      screen.current.opacity = wake;
      screen.current.color.setRGB(1 + blowout * 6, 1 + blowout * 6, 1 + blowout * 6);
    }
    if (bloom.current) {
      const m = bloom.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.3 * wake + 1.6 * easeInOut(span(t, T.through - 0.5, T.through + 0.2));
    }
  });

  return (
    <group ref={body} position={[0, -0.18, 0]}>
      {/* base */}
      <RoundedBox args={[3.5, 0.14, 2.35]} radius={0.055} smoothness={4} material={shell} />
      {/* deck inset */}
      <RoundedBox
        args={[3.36, 0.03, 2.22]}
        radius={0.03}
        smoothness={3}
        position={[0, 0.07, 0]}
        material={deck}
      />
      {/* keys */}
      {keys.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.132, 0.032, 0.132]} />
          <meshStandardMaterial
            color="#1a2038"
            emissive="#6fd6ee"
            emissiveIntensity={0.14}
            roughness={0.62}
            metalness={0.4}
          />
        </mesh>
      ))}
      {/* trackpad */}
      <RoundedBox
        args={[1.05, 0.014, 0.66]}
        radius={0.02}
        smoothness={3}
        position={[0, 0.093, 0.72]}
      >
        <meshPhysicalMaterial color="#10142a" metalness={0.5} roughness={0.24} clearcoat={1} />
      </RoundedBox>

      {/* hinge + lid, pivoted at the back edge of the base */}
      <group ref={lid} position={[0, 0.07, -1.16]}>
        <RoundedBox
          args={[3.5, 2.24, 0.1]}
          radius={0.05}
          smoothness={4}
          position={[0, 1.12, -0.05]}
          material={shell}
        />
        {/* bezel */}
        <mesh position={[0, 1.12, 0.012]}>
          <planeGeometry args={[3.34, 2.08]} />
          <meshStandardMaterial color="#05060d" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* panel */}
        <mesh position={[0, 1.12, 0.018]}>
          <planeGeometry args={[3.16, 1.92]} />
          <meshBasicMaterial
            ref={screen}
            map={texture}
            transparent
            toneMapped={false}
            opacity={0}
          />
        </mesh>
        {/* the light the panel throws forward */}
        <mesh ref={bloom} position={[0, 1.32, 0.1]}>
          <planeGeometry args={[3.6, 2.5]} />
          <meshBasicMaterial
            map={glow}
            color="#6fd6ee"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        {/* and the light it actually casts on the deck */}
        <pointLight position={[0, 1, 0.6]} color="#6fd6ee" intensity={3} distance={5} />
      </group>
    </group>
  );
}

/* ------------------------------ the camera ------------------------------ */

function Rig({
  clock,
  onDone,
}: {
  clock: React.MutableRefObject<number>;
  onDone: () => void;
}) {
  const { camera } = useThree();
  const fired = useRef(false);

  useFrame((state, delta) => {
    clock.current += Math.min(delta, 0.05);
    const t = clock.current;

    // Wide three-quarter view, then a straight push through the panel.
    const settle = easeOut(span(t, 0, 1.6));
    const push = easeInOut(span(t, T.dolly, T.through));

    // fov is vertical, so a portrait viewport sees a much narrower slice of
    // the world. Back off until the whole machine fits across, or a phone
    // gets a close-up of the hinge instead of a laptop.
    const aspect = state.size.width / state.size.height;
    // The machine is 3.5 wide and turned ~24 degrees, so it projects about
    // 4.15 across; the coefficient is what keeps that inside a portrait
    // frame with margin to spare, and resolves to 1 on any landscape one.
    const fit = Math.max(1, 1.25 / aspect);

    const startX = (1.6 - 0.7 * settle) * fit;
    // Portrait frames are tall and the machine is wide: look down on it
    // harder, so it fills the frame instead of floating in a band.
    const startY = (1.7 - 0.55 * settle) * Math.min(fit, 2.4);
    const startZ = (6.6 - 1.35 * settle) * fit;

    camera.position.set(
      startX * (1 - push),
      startY + (1.02 - startY) * push,
      startZ + (0.35 - startZ) * push,
    );
    camera.lookAt(0, 0.5 + 0.52 * push, -0.9 * push);

    if (!fired.current && t >= T.end) {
      fired.current = true;
      onDone();
    }
  });

  return null;
}

/* -------------------------------- scene -------------------------------- */

export default function Boot({ onDone }: { onDone: () => void }) {
  const clock = useRef(0);
  const [gone, setGone] = useState(false);

  const finish = useCallback(() => {
    setGone(true);
    onDone();
  }, [onDone]);

  // Skipping jumps the clock rather than unmounting mid-frame, so the
  // white-out still plays and the handoff never flickers.
  const skip = useCallback(() => {
    if (clock.current < T.through - 0.35) clock.current = T.through - 0.35;
  }, []);

  return (
    <div className={`boot${gone ? ' boot--gone' : ''}`} onClick={skip}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [1.6, 1.7, 6.6], fov: 40 }}
      >
        <color attach="background" args={['#05060d']} />
        <fog attach="fog" args={['#05060d', 9, 18]} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={2.1} color="#dce8ff" />
        <directionalLight position={[-5, 2, -3]} intensity={0.9} color="#8d7bf2" />
        <directionalLight position={[0, 2, 7]} intensity={0.7} color="#6fd6ee" />

        <Laptop clock={clock} />

        <ContactShadows
          position={[0, -0.28, 0]}
          opacity={0.7}
          scale={12}
          blur={2.6}
          far={4}
          color="#000308"
        />

        {/* Lightformers give the aluminium something worth reflecting. */}
        <Environment resolution={256}>
          <Lightformer intensity={2.6} position={[0, 5, 3]} scale={[14, 8, 1]} color="#eaf3ff" />
          <Lightformer intensity={2.2} position={[-7, 1, 3]} scale={[10, 12, 1]} color="#7d78ee" />
          <Lightformer intensity={2.4} position={[7, 0, 2]} scale={[10, 12, 1]} color="#6fd6ee" />
        </Environment>

        <Rig clock={clock} onDone={finish} />
      </Canvas>

      <button type="button" className="boot-skip mono" onClick={skip}>
        Skip intro
      </button>
    </div>
  );
}
