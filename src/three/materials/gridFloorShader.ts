import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/lib/tokens";

const vertexShader = /* glsl */ `
  varying vec2 vCoord;
  varying float vViewDist;

  void main() {
    vCoord = position.xy;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDist = length(mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorMajor;
  uniform vec3 uColorMinor;
  uniform float uCellSize;
  uniform float uMajorEvery;
  uniform float uOpacity;
  uniform float uFadeStart;
  uniform float uFadeEnd;
  uniform float uScanSpeed;
  uniform float uScanPeriod;

  varying vec2 vCoord;
  varying float vViewDist;

  // Derivative-free line test: distance (in local units) from coord to the
  // nearest grid line, then a fixed-width smoothstep — avoids relying on
  // fwidth(), which some software/headless GL contexts leave unreliable.
  float gridLine(vec2 coord, float cell, float thickness) {
    vec2 g = fract(coord / cell + 0.5) - 0.5;
    float d = min(abs(g.x), abs(g.y)) * cell;
    return 1.0 - smoothstep(0.0, thickness, d);
  }

  void main() {
    float minor = gridLine(vCoord, uCellSize, 0.16);
    float major = gridLine(vCoord, uCellSize * uMajorEvery, 0.26);

    vec3 color = uColorMinor * minor * 0.5 + uColorMajor * major;

    float scanDist = abs(mod(vCoord.y - uTime * uScanSpeed, uScanPeriod) - uScanPeriod * 0.5);
    float scan = 1.0 - smoothstep(0.0, uScanPeriod * 0.06, scanDist);
    color += uColorMajor * scan * 0.6;

    float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, vViewDist);
    float alpha = clamp(minor * 0.35 + major * 0.8 + scan * 0.4, 0.0, 1.0) * fade * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;

export const GridFloorShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorMajor: new THREE.Color(palette.brass),
    uColorMinor: new THREE.Color(palette.line),
    uCellSize: 1.5,
    uMajorEvery: 5.0,
    uOpacity: 0.18,
    uFadeStart: 45.0,
    uFadeEnd: 85.0,
    uScanSpeed: 4.0,
    uScanPeriod: 18.0,
  },
  vertexShader,
  fragmentShader
);

extend({ GridFloorMaterial: GridFloorShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    gridFloorMaterial: ThreeElement<typeof GridFloorShaderMaterial>;
  }
}
