"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { scrollState } from "@/lib/scroll-state";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Full-viewport shader plane: a drifting particle/noise field that
 * distorts along the scroll axis proportional to scroll velocity.
 * Sits under the CSS blueprint grid; extremely cheap (one quad).
 */

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uVelocity;
  uniform vec2 uResolution;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y);

    // Scroll velocity smears the field vertically (motion-blur-like shear).
    float shear = uVelocity * 0.35;
    p.y += noise(p * 3.0 + uTime * 0.05) * shear;

    // Slow drifting fog.
    float fog = noise(p * 1.4 + vec2(uTime * 0.02, -uTime * 0.015));
    fog = smoothstep(0.35, 0.85, fog) * 0.05;

    // Sparse particle lattice: jittered cells, only a few light up.
    vec2 cell = p * 22.0;
    vec2 id = floor(cell);
    vec2 gv = fract(cell) - 0.5;
    float rnd = hash(id);
    vec2 offset = (vec2(hash(id + 1.3), hash(id + 7.1)) - 0.5) * 0.6;
    float d = length(gv - offset);
    float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + rnd) + rnd * 6.28);
    float dot = smoothstep(0.035, 0.0, d) * step(0.93, rnd) * twinkle;

    // Vertical trail behind the dot when scrolling fast.
    float trail = smoothstep(0.02, 0.0, abs(gv.x - offset.x))
      * smoothstep(0.5, 0.0, abs(gv.y - offset.y) / max(abs(shear) * 2.0, 0.001))
      * step(0.93, rnd) * abs(uVelocity) * 0.5;

    vec3 col = vec3(fog);
    col += uAccent * (dot * 0.55 + trail * 0.35);
    col += vec3(0.85) * dot * 0.25;

    // Vignette so it doesn't fight the content.
    float vig = 1.0 - smoothstep(0.55, 1.1, length(uv - vec2(0.5, 0.4)) * 1.15);
    gl_FragColor = vec4(col * vig, 1.0);
  }
`;

function FieldPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uAccent: { value: new THREE.Color("#00fc35") },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = clock.elapsedTime;
    mat.current.uniforms.uVelocity.value = scrollState.smoothVelocity;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function FieldBackground() {
  // Skip the extra GL context on reduced-motion or coarse-pointer devices;
  // the CSS blueprint grid still provides the texture there.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const enabled = !reduced && !coarse;

  if (!enabled) return null;

  return (
    <div className="field-canvas" aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 1] }}
        frameloop="always"
      >
        <color attach="background" args={["#050505"]} />
        <FieldPlane />
      </Canvas>
    </div>
  );
}
