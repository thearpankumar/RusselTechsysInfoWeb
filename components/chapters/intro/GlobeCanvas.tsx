"use client";
/* eslint-disable react-hooks/immutability -- three.js objects are mutated per frame inside useFrame (the idiomatic R3F pattern), never during render. */

// Three.js dot-matrix globe. Loaded only through Globe.tsx (next/dynamic, ssr:false).
import * as React from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ARC_TARGETS, BENGALURU, GLOBE_POINTS, decodeMask, fibonacciLatLng, latLngToXYZ } from "./geo";

export interface ProgressSource {
  get(): number;
}

export interface GlobeCanvasProps {
  mask: string;
  /** "scroll": settle follows progress.get() (0..1). "auto": settles on its own after a pause. "none": rotate only. */
  settle: "scroll" | "auto" | "none";
  progress?: ProgressSource;
  /** Render loop on/off (paused when offscreen). */
  active: boolean;
  /** Lower overall intensity (gate page). */
  dim?: boolean;
  /** Page surface behind the globe; the occluding sphere matches it. */
  surface?: "background" | "canvas";
}

/** Resolve a token colour by probing a utility class (no raw colour values in components). */
function tokenColor(className: string): THREE.Color {
  const el = document.createElement("span");
  el.className = className;
  el.style.display = "none";
  document.body.appendChild(el);
  const c = getComputedStyle(el).color;
  el.remove();
  const color = new THREE.Color();
  try {
    color.setStyle(c);
  } catch {
    color.setRGB(0.5, 0.5, 0.5);
  }
  return color;
}

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

function lerpAngle(a: number, b: number, t: number) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

const DOT_VERTEX = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (3.2 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const DOT_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(uColor, uOpacity);
    // uColor is in linear working space (THREE.Color); convert so the token reads true on screen.
    #include <colorspace_fragment>
  }
`;
const RIM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const RIM_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 5.0);
    gl_FragColor = vec4(uColor, f * uStrength);
  }
`;

function buildArc(from: THREE.Vector3, to: THREE.Vector3, segments = 72): Float32Array {
  const angle = from.angleTo(to);
  const lift = 0.06 + (angle / Math.PI) * 0.32;
  const pts = new Float32Array((segments + 1) * 3);
  const q = new THREE.Quaternion();
  const axis = new THREE.Vector3().crossVectors(from, to).normalize();
  const v = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    q.setFromAxisAngle(axis, angle * t);
    v.copy(from).applyQuaternion(q).multiplyScalar(1.003 + Math.sin(Math.PI * t) * lift);
    pts.set([v.x, v.y, v.z], i * 3);
  }
  return pts;
}

function GlobeScene({ mask, settle, progress, dim, surface = "background" }: Omit<GlobeCanvasProps, "active">) {
  const group = React.useRef<THREE.Group>(null);
  const autoY = React.useRef(-0.6);
  const start = React.useRef<number | null>(null);
  const { camera, gl } = useThree();

  const theme = useTheme();
  const colors = React.useMemo(
    () => ({
      dot: tokenColor("text-chart-past"),
      mid: tokenColor("text-chart-mid"),
      white: tokenColor("text-primary"),
      bg: tokenColor(surface === "canvas" ? "text-canvas" : "text-background"),
    }),
    // theme: re-probe token colours when the light/dark theme flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [surface, theme]
  );

  const dots = React.useMemo(() => {
    const idx = decodeMask(mask);
    const pos = new Float32Array(idx.length * 3);
    idx.forEach((i, k) => {
      const [lat, lng] = fibonacciLatLng(i, GLOBE_POINTS);
      pos.set(latLngToXYZ(lat, lng, 1), k * 3);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.ShaderMaterial({
      vertexShader: DOT_VERTEX,
      fragmentShader: DOT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        // chart-mid at reduced opacity: land reads on a projector and stays calm.
        uColor: { value: colors.mid },
        uOpacity: { value: dim ? 0.35 : 0.5 },
        uSize: { value: 3.2 },
        uPixelRatio: { value: gl.getPixelRatio() },
      },
    });
    return new THREE.Points(geo, mat);
  }, [mask, colors, dim, gl]);

  const occluder = React.useMemo(
    () => new THREE.Mesh(new THREE.SphereGeometry(0.992, 48, 48), new THREE.MeshBasicMaterial({ color: colors.bg })),
    [colors]
  );

  const rim = React.useMemo(
    () =>
      new THREE.Mesh(
        new THREE.SphereGeometry(1.01, 64, 64),
        new THREE.ShaderMaterial({
          vertexShader: RIM_VERTEX,
          fragmentShader: RIM_FRAGMENT,
          transparent: true,
          depthWrite: false,
          uniforms: { uColor: { value: colors.white }, uStrength: { value: dim ? 0.18 : 0.32 } },
        })
      ),
    [colors, dim]
  );

  const blr = React.useMemo(() => new THREE.Vector3(...latLngToXYZ(BENGALURU.lat, BENGALURU.lng, 1)), []);

  const arcs = React.useMemo(
    () =>
      ARC_TARGETS.map((t) => {
        const to = new THREE.Vector3(...latLngToXYZ(t.lat, t.lng, 1));
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(buildArc(blr, to), 3));
        geo.setDrawRange(0, 0);
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: colors.mid, transparent: true, opacity: 0.85, depthWrite: false }));
        const end = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), new THREE.MeshBasicMaterial({ color: colors.mid, transparent: true, opacity: 0 }));
        end.position.copy(to.clone().multiplyScalar(1.004));
        end.lookAt(to.clone().multiplyScalar(2));
        return { line, end, count: geo.getAttribute("position").count };
      }),
    [blr, colors]
  );

  const marker = React.useMemo(() => {
    const g = new THREE.Group();
    g.position.copy(blr.clone().multiplyScalar(1.005));
    g.lookAt(blr.clone().multiplyScalar(2));
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.018, 24), new THREE.MeshBasicMaterial({ color: colors.white, transparent: true, opacity: 0 }));
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.024, 0.028, 48), new THREE.MeshBasicMaterial({ color: colors.white, transparent: true, opacity: 0, depthWrite: false }));
    g.add(dot, ring);
    return { g, dot, ring };
  }, [blr, colors]);

  // Dispose GPU resources on unmount.
  React.useEffect(
    () => () => {
      [dots, occluder, rim, marker.dot, marker.ring, ...arcs.flatMap((a) => [a.line, a.end])].forEach((o) => {
        const m = o as THREE.Mesh;
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    },
    [dots, occluder, rim, marker, arcs]
  );

  const targetY = -BENGALURU.lng * (Math.PI / 180);
  const targetX = BENGALURU.lat * (Math.PI / 180);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const since = t - start.current;

    let s = 0;
    if (settle === "scroll") s = smooth((progress?.get() ?? 0) / 0.7);
    else if (settle === "auto") s = smooth((since - 2.2) / 3.2);

    autoY.current += Math.min(delta, 0.05) * 0.06 * (1 - s);
    g.rotation.y = lerpAngle(autoY.current, targetY, s);
    g.rotation.x = 0.32 + (targetX - 0.32) * s;

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = 3.8 - 0.35 * s; // settled z≈3.45 keeps the whole sphere (r=1, fov 35) inside the canvas
    cam.updateProjectionMatrix();

    // Marker: appears as the globe settles; a slow, quiet pulse.
    const m = smooth((s - 0.35) / 0.3);
    (marker.dot.material as THREE.MeshBasicMaterial).opacity = m;
    const phase = (t % 2.4) / 2.4;
    marker.ring.scale.setScalar(1 + phase * 2.6);
    (marker.ring.material as THREE.MeshBasicMaterial).opacity = m * (1 - phase) * 0.7;

    // Arcs draw out after the marker lands.
    const a = smooth((s - 0.55) / 0.45);
    arcs.forEach((arc, i) => {
      const local = smooth(a * 1.4 - i * 0.12);
      arc.line.geometry.setDrawRange(0, Math.floor(arc.count * local));
      (arc.end.material as THREE.MeshBasicMaterial).opacity = local >= 0.98 ? 1 : 0;
    });
  });

  return (
    <group ref={group}>
      <primitive object={occluder} />
      <primitive object={dots} />
      <primitive object={rim} />
      <primitive object={marker.g} />
      {arcs.map((arc, i) => (
        <React.Fragment key={ARC_TARGETS[i].id}>
          <primitive object={arc.line} />
          <primitive object={arc.end} />
        </React.Fragment>
      ))}
    </group>
  );
}

export default function GlobeCanvas({ active, ...props }: GlobeCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.8], fov: 35, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <GlobeScene {...props} />
    </Canvas>
  );
}
