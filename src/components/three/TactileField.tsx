"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { scrollState } from "@/lib/scroll-state";

/* ------------------------------------------------------------------ */
/*  Shaders                                                             */
/* ------------------------------------------------------------------ */

const noiseGLSL = /* glsl */ `
  // Simplex-ish value noise, cheap enough for 160x160 verts per frame.
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;     // pointer in local plane coords
  uniform float uPressure;   // 0..1, eased hover intensity
  uniform float uRadius;     // contact radius
  uniform float uDepth;      // max indentation
  uniform float uScroll;     // scroll velocity -1..1

  varying float vHeat;
  varying float vElev;
  varying vec2 vUv;

  ${noiseGLSL}

  void main() {
    vUv = uv;
    vec3 p = position;

    // Ambient membrane breathing: layered low-frequency noise.
    float n1 = snoise(p.xy * 0.55 + vec2(uTime * 0.08, -uTime * 0.05));
    float n2 = snoise(p.xy * 1.6 + vec2(-uTime * 0.12, uTime * 0.07));
    float ambient = n1 * 0.22 + n2 * 0.06;

    // Scroll velocity shears the field slightly, like inertia on a sensor pad.
    ambient += snoise(p.xy * 0.9 + uTime * 0.3) * abs(uScroll) * 0.12;

    // Tactile contact: gaussian indentation under the pointer with a ring.
    float d = distance(p.xy, uPointer);
    float g = exp(-(d * d) / (uRadius * uRadius));
    float ring = smoothstep(uRadius * 1.6, uRadius * 0.9, d) * (1.0 - g);
    float press = -(g * uDepth) + ring * uDepth * 0.18;
    press *= uPressure;

    p.z += ambient + press;

    vHeat = clamp(g * uPressure * 1.4 + ring * uPressure * 0.35, 0.0, 1.0);
    vElev = p.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vHeat;
  varying float vElev;
  varying vec2 vUv;

  void main() {
    // Fade the grid toward its edges so it dissolves into the page.
    vec2 c = vUv - 0.5;
    float edge = 1.0 - smoothstep(0.32, 0.5, length(c));

    // Base line color subtly modulated by elevation, then heat-mapped.
    vec3 col = uBase * (0.75 + vElev * 0.9);
    col = mix(col, uAccent, pow(vHeat, 1.35));

    float alpha = uOpacity * edge * (0.55 + vHeat * 0.45);
    gl_FragColor = vec4(col, alpha);
  }
`;

const pointsVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPressure;
  uniform float uRadius;
  uniform float uDepth;
  uniform float uScroll;
  uniform float uPixelRatio;

  varying float vHeat;
  varying vec2 vUv;

  ${noiseGLSL}

  void main() {
    vUv = uv;
    vec3 p = position;

    float n1 = snoise(p.xy * 0.55 + vec2(uTime * 0.08, -uTime * 0.05));
    float n2 = snoise(p.xy * 1.6 + vec2(-uTime * 0.12, uTime * 0.07));
    float ambient = n1 * 0.22 + n2 * 0.06;
    ambient += snoise(p.xy * 0.9 + uTime * 0.3) * abs(uScroll) * 0.12;

    float d = distance(p.xy, uPointer);
    float g = exp(-(d * d) / (uRadius * uRadius));
    float ring = smoothstep(uRadius * 1.6, uRadius * 0.9, d) * (1.0 - g);
    float press = (-(g * uDepth) + ring * uDepth * 0.18) * uPressure;

    p.z += ambient + press + 0.01;
    vHeat = clamp(g * uPressure * 1.4, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + vHeat * 4.0) * uPixelRatio * (6.0 / -mv.z);
  }
`;

const pointsFragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying float vHeat;
  varying vec2 vUv;

  void main() {
    vec2 c = vUv - 0.5;
    float edge = 1.0 - smoothstep(0.3, 0.5, length(c));
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    vec3 col = mix(uBase * 1.6, uAccent, vHeat);
    float alpha = (0.35 + vHeat * 0.65) * edge;
    gl_FragColor = vec4(col, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

type Props = {
  accent?: string;
  base?: string;
  /** Grid resolution per side. 120–160 stays cheap; drop on mobile. */
  segments?: number;
  onHoverChange?: (hovering: boolean) => void;
};

export function TactileField({
  accent = "#00fc35",
  base = "#3a3a40",
  segments = 140,
  onHoverChange,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const lineMat = useRef<THREE.ShaderMaterial>(null);
  const pointMat = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(999, 999)); // off-field until hover
  const target = useRef(new THREE.Vector2(999, 999));
  const pressure = useRef(0);
  const hovering = useRef(false);
  const { gl } = useThree();

  const SIZE = 6;

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(SIZE, SIZE, segments, segments),
    [segments],
  );
  const bezel = useMemo(
    () => new THREE.EdgesGeometry(new THREE.PlaneGeometry(SIZE * 0.92, SIZE * 0.92)),
    [],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uPressure: { value: 0 },
      uRadius: { value: 0.7 },
      uDepth: { value: 0.9 },
      uScroll: { value: 0 },
      uOpacity: { value: 0.85 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uBase: { value: new THREE.Color(base) },
      uAccent: { value: new THREE.Color(accent) },
    }),
    [accent, base, gl],
  );

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    // e.point is world-space on the hit plane; convert to the field's local XY.
    if (!group.current) return;
    const local = group.current.worldToLocal(e.point.clone());
    target.current.set(local.x, local.y);
    if (!hovering.current) {
      hovering.current = true;
      onHoverChange?.(true);
    }
  };

  const onLeave = () => {
    hovering.current = false;
    onHoverChange?.(false);
  };

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 10); // frame-rate independent lerp

    // Ease pointer + pressure so contact feels like a pad, not a laser.
    pointer.current.lerp(target.current, k);
    const goal = hovering.current ? 1 : 0;
    pressure.current += (goal - pressure.current) * (1 - Math.exp(-dt * 5));

    for (const m of [lineMat.current, pointMat.current]) {
      if (!m) continue;
      m.uniforms.uTime.value = t;
      m.uniforms.uPointer.value.copy(pointer.current);
      m.uniforms.uPressure.value = pressure.current;
      m.uniforms.uScroll.value = scrollState.smoothVelocity;
    }

    // Slow idle drift; the whole array leans toward the pointer a touch.
    if (group.current) {
      const lean = hovering.current ? 0.06 : 0;
      const rx = -0.95 + Math.sin(t * 0.25) * 0.03 + (pointer.current.y / SIZE) * lean;
      const rz = Math.sin(t * 0.18) * 0.04 - (pointer.current.x / SIZE) * lean;
      group.current.rotation.x += (rx - group.current.rotation.x) * k;
      group.current.rotation.z += (rz - group.current.rotation.z) * k;
    }
  });

  return (
    <group ref={group} rotation={[-0.95, 0, 0]} position={[0, -0.35, 0]}>
      {/* Wireframe membrane */}
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={lineMat}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          wireframe
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sensor nodes at the vertices */}
      <points geometry={geometry}>
        <shaderMaterial
          ref={pointMat}
          uniforms={uniforms}
          vertexShader={pointsVertexShader}
          fragmentShader={pointsFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Invisible flat hit-plane: stable raycasting regardless of displacement */}
      <mesh onPointerMove={onMove} onPointerLeave={onLeave} visible={false}>
        <planeGeometry args={[SIZE * 1.15, SIZE * 1.15]} />
        <meshBasicMaterial />
      </mesh>

      {/* Frame ring: a thin instrument bezel around the sensor array */}
      <lineSegments geometry={bezel} position={[0, 0, -0.02]}>
        <lineBasicMaterial color={base} transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}
