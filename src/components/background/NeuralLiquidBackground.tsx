"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useIsMobile } from "./useIsMobile";
import { useReducedMotion } from "./useReducedMotion";

interface NeuralLiquidBackgroundProps {
  hoverState?: number;
  scroll?: number;
}

export function NeuralLiquidBackground({
  hoverState = 0,
  scroll = 0,
}: NeuralLiquidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const canvas = canvasRef.current ?? document.createElement("canvas");
    if (!canvasRef.current) {
      canvasRef.current = canvas;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      container.appendChild(canvas);
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: scroll },
      uHoverState: { value: hoverState },
      uColorPrimary: {
        value: new THREE.Color(0x00d4ff),
      },
      uColorSecondary: {
        value: new THREE.Color(0x7c3aed),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform float uScroll;
        uniform float uHoverState;
        uniform vec3 uColorPrimary;
        uniform vec3 uColorSecondary;

        varying vec2 vUv;

        #define MAX_STEPS 128
        #define MAX_DIST 20.0
        #define SURF_DIST 0.001

        float hash(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float n = mix(
            mix(
              mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
              mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x),
              f.y
            ),
            mix(
              mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
              mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x),
              f.y
            ),
            f.z
          );
          return n;
        }

        float smin(float a, float b, float k) {
          float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
          return mix(b, a, h) - k * h * (1.0 - h);
        }

        float sdSphere(vec3 p, float r) {
          return length(p) - r;
        }

        float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
          vec3 ab = b - a;
          float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
          vec3 c = a + t * ab;
          return length(p - c) - r;
        }

        float neuralBlob(vec3 p, float seed) {
          float t = uTime * 0.4 + seed * 13.17;
          vec3 q = p;
          q += 0.35 * sin(q.zxy * 1.5 + t);
          q += 0.25 * sin(q.yzx * 3.0 - t * 1.3);
          float base = sdSphere(q, 0.8 + 0.15 * sin(t * 1.3));

          float accum = 0.0;
          vec3 rp = p * 3.0;
          for (int i = 0; i < 3; i++) {
            rp.xy += vec2(
              sin(rp.y * 2.0 + t * 0.8),
              cos(rp.x * 2.0 - t * 0.6)
            ) * 0.5;
            accum += noise(rp + float(i) * 3.17);
            rp *= 1.4;
          }
          accum /= 3.0;
          base += (accum - 0.5) * 0.25;

          float pulse = 0.03 * sin(t * 4.0 + p.y * 5.0);
          base += pulse;
          return base;
        }

        float map(vec3 p, out float matId) {
          vec3 cp = p;
          cp.yz *= mat2(cos(0.4 * uTime), -sin(0.4 * uTime), sin(0.4 * uTime), cos(0.4 * uTime));
          cp.xz *= mat2(cos(0.27 * uTime), -sin(0.27 * uTime), sin(0.27 * uTime), cos(0.27 * uTime));

          float d = 1e5;
          matId = 0.0;

          vec3 o1 = vec3(-1.4, 0.2, 0.0);
          vec3 o2 = vec3(1.3, -0.1, 0.5);
          vec3 o3 = vec3(0.0, 0.9, -0.7);
          vec3 o4 = vec3(-0.6, -1.1, -0.8);

          float d1 = neuralBlob(cp - o1, 1.0);
          float d2 = neuralBlob(cp - o2, 2.0);
          float d3 = neuralBlob(cp - o3, 3.0);
          float d4 = neuralBlob(cp - o4, 4.0);

          d = smin(d, d1, 0.35);
          d = smin(d, d2, 0.35);
          d = smin(d, d3, 0.35);
          d = smin(d, d4, 0.35);
          matId = 1.0;

          float c12 = sdCapsule(cp, o1, o2, 0.18);
          float c23 = sdCapsule(cp, o2, o3, 0.18);
          float c34 = sdCapsule(cp, o3, o4, 0.18);
          float c41 = sdCapsule(cp, o4, o1, 0.18);
          float conn = min(min(c12, c23), min(c34, c41));

          d = smin(d, conn, 0.25);
          return d;
        }

        vec3 getNormal(vec3 p) {
          float e = 0.0025;
          float matId;
          vec2 h = vec2(e, 0.0);
          float d = map(p, matId);
          vec3 n = d - vec3(
            map(p - h.xyy, matId),
            map(p - h.yxy, matId),
            map(p - h.yyx, matId)
          );
          return normalize(n);
        }

        float softShadow(vec3 ro, vec3 rd) {
          float res = 1.0;
          float t = 0.02;
          float matId;
          for (int i = 0; i < 32; i++) {
            float h = map(ro + rd * t, matId);
            if (h < 0.001) return 0.0;
            res = min(res, 10.0 * h / t);
            t += clamp(h, 0.02, 0.2);
            if (t > 8.0) break;
          }
          return clamp(res, 0.0, 1.0);
        }

        float raymarch(vec3 ro, vec3 rd, out vec3 p, out float matId) {
          float dO = 0.0;
          matId = 0.0;
          for (int i = 0; i < MAX_STEPS; i++) {
            p = ro + rd * dO;
            float dS = map(p, matId);
            if (dS < SURF_DIST || dO > MAX_DIST) break;
            dO += dS;
          }
          return dO;
        }

        vec3 render(vec3 ro, vec3 rd) {
          vec3 p;
          float matId;
          float d = raymarch(ro, rd, p, matId);
          vec3 col = vec3(0.0);

          if (d > MAX_DIST) {
            float v = pow(1.0 - max(rd.y, 0.0), 2.0);
            col = mix(vec3(0.0), vec3(0.02, 0.05, 0.08), v);
            return col;
          }

          vec3 n = getNormal(p);

          float distFog = clamp(d / MAX_DIST, 0.0, 1.0);
          float fog = 1.0 - exp(-distFog * 3.0);

          vec3 lp1 = vec3(3.0, 2.0, 2.0);
          vec3 lp2 = vec3(-2.5, 1.5, -2.0);
          vec3 lp3 = vec3(0.0, -3.0, 1.5);

          lp1.xz *= mat2(cos(uTime * 0.35), -sin(uTime * 0.35), sin(uTime * 0.35), cos(uTime * 0.35));
          lp2.yz *= mat2(cos(uTime * 0.25), -sin(uTime * 0.25), sin(uTime * 0.25), cos(uTime * 0.25));
          lp3.xy *= mat2(cos(uTime * 0.45), -sin(uTime * 0.45), sin(uTime * 0.45), cos(uTime * 0.45));

          vec3 lc1 = vec3(0.0, 0.83, 1.0);
          vec3 lc2 = vec3(0.49, 0.23, 0.92);
          vec3 lc3 = vec3(0.13, 0.65, 0.98);

          vec3 lightAcc = vec3(0.0);
          vec3 amb = vec3(0.08);

          vec3 ldir1 = normalize(lp1 - p);
          vec3 ldir2 = normalize(lp2 - p);
          vec3 ldir3 = normalize(lp3 - p);

          float diff1 = max(dot(n, ldir1), 0.0);
          float diff2 = max(dot(n, ldir2), 0.0);
          float diff3 = max(dot(n, ldir3), 0.0);

          float shadow1 = softShadow(p + n * 0.01, ldir1);
          float shadow2 = softShadow(p + n * 0.01, ldir2);
          float shadow3 = softShadow(p + n * 0.01, ldir3);

          lightAcc += diff1 * lc1 * shadow1;
          lightAcc += diff2 * lc2 * shadow2;
          lightAcc += diff3 * lc3 * shadow3;

          vec3 viewDir = normalize(-rd);
          vec3 h1 = normalize(ldir1 + viewDir);
          float spec1 = pow(max(dot(n, h1), 0.0), 64.0);
          vec3 specCol = lc3 * spec1 * 1.2;

          float fres = pow(1.0 - max(dot(viewDir, n), 0.0), 3.0);

          float neuralMix = sin(uTime * 0.5) * 0.5 + 0.5;
          vec3 baseNeural = mix(vec3(0.0, 0.83, 1.0), vec3(0.49, 0.23, 0.92), neuralMix);
          vec3 colorGlow = vec3(0.13, 0.65, 0.98);

          float cursorInfluence = length(uMouse);
          float hueShift = uMouse.x * 0.6;
          float brightness = 0.8 + 0.2 * uMouse.y;

          vec3 base = mix(uColorPrimary, uColorSecondary, 0.5 + 0.5 * sin(uTime * 0.3 + hueShift));
          base = mix(base, baseNeural, 0.7);
          base *= brightness;

          float edge = fres * 0.8;
          vec3 fresCol = colorGlow * edge;

          col = base * (amb + lightAcc) + specCol + fresCol;

          float ao = clamp(1.0 - fog * 1.2, 0.45, 1.0);
          col *= ao;

          vec3 fogCol = vec3(0.01, 0.02, 0.03);
          col = mix(fogCol, col, 1.0 - fog);

          float vignette = smoothstep(1.4, 0.7, length(vUv - 0.5));
          col *= vignette;

          return col;
        }

        void main() {
          vec2 uv = (vUv * 2.0 - 1.0);
          uv.x *= uResolution.x / uResolution.y;

          float depth = mix(-2.5, -0.8, clamp(uScroll, 0.0, 1.0));

          vec3 ro = vec3(0.0, 0.0, 3.0 + depth);
          vec3 rd = normalize(vec3(uv, -1.6));

          vec2 m = uMouse;
          ro.xy += m * 0.5;
          rd.xy += m * 0.35;

          vec3 col = render(ro, rd);

          float glow = smoothstep(0.5, 1.0, length(col));
          col += vec3(0.05, 0.09, 0.13) * glow;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let start = performance.now();
    let animationFrameId = 0;
    let visible = true;

    const resize = () => {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight, false);
      uniforms.uResolution.value.set(clientWidth, clientHeight);
    };
    resize();

    const onMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((rect.height - (e.clientY - rect.top)) / rect.height) * 2 - 1;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onVisibilityChange = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", resize);

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (!visible) return;

      const now = performance.now();
      const dt = (now - start) / 1000;
      start = now;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      uniforms.uTime.value += dt;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      uniforms.uScroll.value = scroll;
      uniforms.uHoverState.value = hoverState;

      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.clear();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, [hoverState, isMobile, reduced, scroll]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" aria-hidden />;
}


