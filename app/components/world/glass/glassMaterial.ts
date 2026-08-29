import * as THREE from 'three';
import { MAX_PANES } from './pack';
import { OPTICS_ARRAYS } from './recipes';

/**
 * The glass itself.
 *
 * CSS can blur what is behind a pane. It cannot bend it, and bending is the
 * whole difference between glass and frosting. So the world is rendered to a
 * texture and this pass draws it back, displacing the sample wherever a pane
 * covers it.
 *
 * The displacement is concentrated at the rims and near zero across the
 * middle. That is not a compromise for legibility, though it helps it — it is
 * what a thick pane with a rounded edge actually does. A flat interior barely
 * deviates a ray; a curved rim deviates it hard, and deviates red less than
 * blue, which is why the edges of real glass fringe into colour.
 */

const vertex = /* glsl */ `
precision highp float;
in vec3 position;
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;

uniform sampler2D tWorld;
uniform vec2 uRes;
uniform int uCount;
uniform vec4 uRect[${MAX_PANES}];
uniform vec4 uParam[${MAX_PANES}];
uniform vec3 uTint;
uniform float uRimScale;
uniform float uDispScale;

out vec4 fragColor;

const float RIM[3]  = float[3](${OPTICS_ARRAYS.rim.map((n) => n.toFixed(1)).join(', ')});
const float STR[3]  = float[3](${OPTICS_ARRAYS.strength.map((n) => n.toFixed(3)).join(', ')});
const float DISP[3] = float[3](${OPTICS_ARRAYS.dispersion.map((n) => n.toFixed(3)).join(', ')});
const float SPEC[3] = float[3](${OPTICS_ARRAYS.spec.map((n) => n.toFixed(3)).join(', ')});

/* Negative inside, zero on the edge, positive outside.
   \`hs\` is the half-size. Not \`half\` — that is a reserved word in ESSL 3.0
   and naming a parameter with it fails to compile on some drivers and not
   others, which is the worst kind of bug to find later. */
float sdRoundRect(vec2 p, vec2 hs, float r) {
  vec2 q = abs(p) - (hs - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  vec4 base = texture(tWorld, uv);

  /* Nearest pane wins. Panes on this page do not overlap at the same tier,
     and where tiers do overlap — a button on a panel — the nearer surface
     is the one you would see the refraction of anyway. */
  float best = 1e9;
  int hit = -1;
  vec2 bestP = vec2(0.0);
  vec2 bestHs = vec2(0.0);
  float bestR = 0.0;

  for (int i = 0; i < ${MAX_PANES}; i++) {
    if (i >= uCount) break;
    vec4 R = uRect[i];
    vec2 hs = R.zw * 0.5;
    vec2 p = frag - (R.xy + hs);
    float r = min(uParam[i].x, min(hs.x, hs.y));
    float d = sdRoundRect(p, hs, r);
    if (d < best) {
      best = d;
      hit = i;
      bestP = p;
      bestHs = hs;
      bestR = r;
    }
  }

  if (hit < 0 || best > 0.0) {
    fragColor = base;
    return;
  }

  /* Clamped, not trusted. Indexing a const array out of range in GLSL is
     undefined rather than an error, and undefined here means a driver-
     dependent garbage rim width. */
  int tier = clamp(int(uParam[hit].y) - 1, 0, 2);
  float enter = uParam[hit].z;
  float resp = uParam[hit].w;

  /* A responding pane thickens slightly: hovering a card should feel like
     leaning on the glass, not like switching a light on. */
  float rim = RIM[tier] * uRimScale * (1.0 + 0.25 * resp);
  float depth = -best;

  /* 1 at the rim, 0 by the time we are \`rim\` pixels in. Squared so the
     falloff is optical rather than linear, and scaled by enter so a pane
     resolves into glass instead of appearing as glass. */
  float t = 1.0 - smoothstep(0.0, rim, depth);
  t = t * t * enter;

  if (t < 0.002) {
    fragColor = base;
    return;
  }

  /* Outward normal of the rounded rect, analytically. Sampling the SDF for
     a gradient goes wrong at small radii, where the corners of a chip are
     only a few pixels across and a one-pixel step spans the whole curve. */
  vec2 s = sign(bestP);
  vec2 q = abs(bestP) - (bestHs - bestR);
  vec2 g = (q.x > 0.0 && q.y > 0.0)
    ? normalize(max(q, vec2(1e-4)))
    : (q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
  vec2 n = normalize(g * s);

  vec2 off = n * t * (STR[tier] * rim) / uRes;
  float disp = DISP[tier] * uDispScale;

  vec4 mid = texture(tWorld, uv + off);
  vec3 col = vec3(
    texture(tWorld, uv + off * (1.0 + disp)).r,
    mid.g,
    texture(tWorld, uv + off * (1.0 - disp)).b
  );

  /* The station tint already warms every pane's CSS fill. Warming the
     refraction by the same colour is what keeps the two reading as one
     material rather than as a filter over a filter. */
  col = mix(col, col * uTint * 1.15, 0.25 * t);

  /* Lit from the upper left, which is the direction --lens-N-edge-hi
     lights. gl_FragCoord has y up, so up-left is (-x, +y). */
  vec3 L = normalize(vec3(-0.55, 0.6, 0.58));
  float spec = pow(max(dot(normalize(vec3(n, 0.85)), L), 0.0), 22.0)
    * SPEC[tier] * t * (1.0 + 0.6 * resp);

  /* The specular has to raise alpha too. The world canvas is transparent
     over the page background, and a highlight that only wrote colour would
     be invisible everywhere the world is empty — which is most of a pane. */
  fragColor = vec4(col + spec, max(mid.a, spec));
}
`;

export function createGlassMaterial(): THREE.RawShaderMaterial {
  return new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tWorld: { value: null as THREE.Texture | null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uCount: { value: 0 },
      uRect: { value: new Float32Array(MAX_PANES * 4) },
      uParam: { value: new Float32Array(MAX_PANES * 4) },
      uTint: { value: new THREE.Color('#5442b5') },
      uRimScale: { value: 1 },
      uDispScale: { value: 1 },
    },
  });
}
