"use client";

// Procedural low-poly wire harness (no external models). Loaded with next/dynamic({ ssr: false }).
// Exploded → assembled is driven by `progressRef` (0..1, scroll-linked) — read only inside useFrame.
import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import { harnessParts, type HarnessPartId } from "@/content/materials";
import { useTheme } from "@/lib/theme";

/* ---------- theme tokens, read at runtime (no hex in components) ---------- */

type Token = "primary" | "chart-light" | "chart-mid" | "chart-past" | "border" | "canvas" | "background";
// Full class names so Tailwind always generates them for the probe fallback.
const PROBE_CLASS: Record<Token, string> = {
  primary: "bg-primary",
  "chart-light": "bg-chart-light",
  "chart-mid": "bg-chart-mid",
  "chart-past": "bg-chart-past",
  border: "bg-border",
  canvas: "bg-canvas",
  background: "bg-background",
};

type Tokens = Record<Token, THREE.Color> & { glow: THREE.Color; glowHi: THREE.Color };

function readTokens(light: boolean): Tokens {
  const root = getComputedStyle(document.documentElement);
  const out = {} as Tokens;
  for (const t of Object.keys(PROBE_CLASS) as Token[]) {
    let v = root.getPropertyValue(`--color-${t}`).trim();
    if (!v) {
      const probe = document.createElement("span");
      probe.className = PROBE_CLASS[t];
      probe.style.display = "none";
      document.body.appendChild(probe);
      v = getComputedStyle(probe).backgroundColor;
      probe.remove();
    }
    const c = new THREE.Color();
    try {
      c.setStyle(v || "gray");
    } catch {
      c.setStyle("gray");
    }
    out[t] = c;
  }
  // Emissive tint: a faint self-light from the canvas tone on dark; none on light (a near-white glow washes parts out).
  out.glow = light ? new THREE.Color(0, 0, 0) : out.canvas;
  out.glowHi = light ? new THREE.Color(0, 0, 0) : out["chart-past"];
  return out;
}

/* ---------- geometry ---------- */

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);

const trunk = new THREE.CatmullRomCurve3([V(-3.4, 0.1, 0), V(-2.1, -0.15, 0.15), V(-0.7, 0.12, -0.1), V(0.7, 0, 0)]);
const branches = [
  new THREE.CatmullRomCurve3([V(0.7, 0, 0), V(1.5, 0.45, 0.1), V(2.3, 1.15, 0.2), V(2.85, 1.45, 0.2)]),
  new THREE.CatmullRomCurve3([V(0.7, 0, 0), V(1.6, 0.03, -0.05), V(2.5, -0.05, -0.2), V(3.3, 0, -0.2)]),
  new THREE.CatmullRomCurve3([V(0.7, 0, 0), V(1.4, -0.5, 0.1), V(2.0, -1.15, 0.25), V(2.45, -1.55, 0.3)]),
];
const R_TRUNK = 0.17;
const R_BRANCH = 0.1;

function subCurve(curve: THREE.Curve<THREE.Vector3>, a: number, b: number, n = 8) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) pts.push(curve.getPointAt(a + ((b - a) * i) / n));
  return new THREE.CatmullRomCurve3(pts);
}
const quatAlong = (d: THREE.Vector3) => new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());

interface Instance {
  base: THREE.Vector3;
  quat: THREE.Quaternion;
  offset: THREE.Vector3;
  node: (m: THREE.Material) => React.ReactNode;
}

// Harness ends: trunk start (pointing -tangent) and the three branch ends.
const ends = [
  { p: trunk.getPointAt(0), d: trunk.getTangentAt(0).negate(), r: R_TRUNK },
  ...branches.map((b) => ({
    p: b.getPointAt(1),
    d: b.getTangentAt(1),
    r: R_BRANCH,
  })),
];

const cyl = (rTop: number, rBot: number, h: number, seg = 18) => new THREE.CylinderGeometry(rTop, rBot, h, seg, 1);

let EDGE_COLOR: THREE.Color | undefined;
function edgeOf(threshold = 25) {
  return <Edges threshold={threshold} color={EDGE_COLOR} />;
}

function buildInstances(edge: THREE.Color): Record<HarnessPartId, Instance[]> {
  EDGE_COLOR = edge;
  const endAt = (k: number, dist: number, explode: number, node: Instance["node"]): Instance => {
    const e = ends[k];
    return {
      base: e.p.clone().addScaledVector(e.d, dist),
      quat: quatAlong(e.d),
      offset: e.d
        .clone()
        .multiplyScalar(explode)
        .add(V(0, 0.15 * (k - 1.5), 0)),
      node,
    };
  };
  const ringOn = (curve: THREE.Curve<THREE.Vector3>, t: number, offset: THREE.Vector3, node: Instance["node"]): Instance => ({
    base: curve.getPointAt(t),
    quat: quatAlong(curve.getTangentAt(t)),
    offset,
    node,
  });

  const wireGeo = [new THREE.TubeGeometry(trunk, 48, R_TRUNK, 10), ...branches.map((b) => new THREE.TubeGeometry(b, 32, R_BRANCH, 8))];
  const connectorGeo = {
    body: cyl(0.3, 0.3, 0.42, 20),
    ring: cyl(0.34, 0.34, 0.14, 20),
    flange: cyl(0.27, 0.27, 0.05, 20),
  };
  const pinGeo = cyl(0.022, 0.022, 0.14, 6);
  const sleeveGeo = new THREE.TubeGeometry(subCurve(trunk, 0.14, 0.46), 24, R_TRUNK + 0.045, 12);
  const braidGeo = new THREE.TubeGeometry(subCurve(branches[1], 0.22, 0.72), 20, R_BRANCH + 0.04, 10);
  const spliceGeo = {
    body: cyl(R_BRANCH + 0.05, R_BRANCH + 0.05, 0.32, 14),
    band: cyl(R_BRANCH + 0.07, R_BRANCH + 0.07, 0.05, 14),
  };
  const pinLayout = [V(0, 0, 0), ...Array.from({ length: 6 }, (_, i) => V(Math.cos((i * Math.PI) / 3) * 0.12, 0, Math.sin((i * Math.PI) / 3) * 0.12))];

  return {
    wire: [
      {
        base: V(0, 0, 0),
        quat: new THREE.Quaternion(),
        offset: V(0, -0.35, -0.6),
        node: (m) =>
          wireGeo.map((g, i) => (
            <mesh key={i} geometry={g} material={m}>
              {edgeOf(40)}
            </mesh>
          )),
      },
    ],
    connector: ends.map((_, k) =>
      endAt(k, 0.58, 1.9, (m) => (
        <>
          <mesh geometry={connectorGeo.body} material={m}>
            {edgeOf()}
          </mesh>
          <mesh geometry={connectorGeo.ring} material={m} position={[0, 0.12, 0]}>
            {edgeOf()}
          </mesh>
          <mesh geometry={connectorGeo.flange} material={m} position={[0, -0.18, 0]}>
            {edgeOf()}
          </mesh>
        </>
      )),
    ),
    contact: ends.map((_, k) =>
      endAt(k, 0.86, 2.9, (m) => (
        <>
          {pinLayout.map((p, i) => (
            <mesh key={i} geometry={pinGeo} material={m} position={p} />
          ))}
        </>
      )),
    ),
    backshell: ends.map((e, k) => {
      const g = cyl(0.24, e.r + 0.06, 0.36, 16);
      return endAt(k, 0.2, 1.2, (m) => (
        <mesh geometry={g} material={m}>
          {edgeOf()}
        </mesh>
      ));
    }),
    heatshrink: ends.map((e, k) => {
      const g = cyl(e.r + 0.06, e.r + 0.025, 0.34, 14);
      return endAt(k, -0.16, 0.6, (m) => (
        <mesh geometry={g} material={m}>
          {edgeOf()}
        </mesh>
      ));
    }),
    sleeving: [
      {
        base: V(0, 0, 0),
        quat: new THREE.Quaternion(),
        offset: V(0, 1.35, 0.4),
        node: (m) => (
          <mesh geometry={sleeveGeo} material={m}>
            {edgeOf(40)}
          </mesh>
        ),
      },
    ],
    braid: [
      {
        base: V(0, 0, 0),
        quat: new THREE.Quaternion(),
        offset: V(0.2, 0.1, 1.5),
        node: (m) => {
          const g = braidGeo;
          return (
            <>
              <mesh geometry={g} material={m} />
              <mesh geometry={g}>
                <meshBasicMaterial wireframe transparent opacity={0.35} color={(m as THREE.MeshStandardMaterial).color} />
              </mesh>
            </>
          );
        },
      },
    ],
    clamp: [
      [trunk, 0.66, R_TRUNK],
      [branches[0], 0.42, R_BRANCH],
    ].map(([c, t, r]) =>
      ringOn(c as THREE.Curve<THREE.Vector3>, t as number, V(0, -1.3, 0.2), (m) => (
        <>
          <mesh material={m} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[(r as number) + 0.07, 0.035, 6, 20]} />
            {edgeOf()}
          </mesh>
          <mesh material={m} position={[0, 0, -((r as number) + 0.16)]}>
            <boxGeometry args={[0.1, 0.05, 0.2]} />
            {edgeOf()}
          </mesh>
        </>
      )),
    ),
    splice: [
      ringOn(branches[2], 0.5, V(0.7, -0.9, 0.5), (m) => (
        <>
          <mesh geometry={spliceGeo.body} material={m}>
            {edgeOf()}
          </mesh>
          <mesh geometry={spliceGeo.band} material={m} position={[0, 0.1, 0]} />
          <mesh geometry={spliceGeo.band} material={m} position={[0, -0.1, 0]} />
        </>
      )),
    ],
    marker: [
      [trunk, 0.07, R_TRUNK],
      [branches[0], 0.83, R_BRANCH],
      [branches[1], 0.86, R_BRANCH],
      [branches[2], 0.82, R_BRANCH],
    ].map(([c, t, r]) => {
      const g = cyl((r as number) + 0.03, (r as number) + 0.03, 0.16, 14);
      return ringOn(c as THREE.Curve<THREE.Vector3>, t as number, V(0, 0.9, 0.7), (m) => (
        <mesh geometry={g} material={m}>
          {edgeOf()}
        </mesh>
      ));
    }),
    lacing: [...[0.52, 0.57, 0.62, 0.86, 0.92].map((t) => [trunk, t, R_TRUNK] as const), ...branches.map((b) => [b, 0.12, R_BRANCH] as const)].map(([c, t, r]) =>
      ringOn(c, t, V(0, 0.75, -0.9), (m) => (
        <mesh material={m} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r + 0.012, 0.014, 4, 18]} />
        </mesh>
      )),
    ),
    grommet: [
      ringOn(trunk, 0.76, V(0, 0.1, -1.6), (m) => (
        <mesh material={m} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R_TRUNK + 0.07, 0.07, 8, 22]} />
          {edgeOf()}
        </mesh>
      )),
    ],
  };
}

/* ---------- parts ---------- */

const BASE_TONE: Record<HarnessPartId, Token> = {
  wire: "chart-mid",
  connector: "chart-light",
  contact: "chart-light",
  backshell: "chart-mid",
  heatshrink: "chart-past",
  sleeving: "chart-past",
  braid: "chart-mid",
  clamp: "chart-light",
  splice: "chart-light",
  marker: "chart-light",
  lacing: "chart-mid",
  grommet: "chart-past",
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Per-part assembly amount (0 exploded → 1 assembled) from the 0..1 scroll progress. */
export function partAssembly(progress: number, i: number, n: number) {
  const q = Math.min(1, Math.max(0, (progress - 0.05) / 0.85));
  return easeOut(Math.min(1, Math.max(0, q * n - i)));
}

function Part({
  id,
  order,
  instances,
  tokens,
  progressRef,
  highlight,
  anyHighlight,
  anchors,
  onHover,
  onSelect,
}: {
  id: HarnessPartId;
  order: number;
  instances: Instance[];
  tokens: Tokens;
  progressRef: React.RefObject<number>;
  highlight: boolean;
  anyHighlight: boolean;
  anchors: React.RefObject<Partial<Record<HarnessPartId, THREE.Object3D | null>>>;
  onHover: (id: HarnessPartId | null) => void;
  onSelect: (id: HarnessPartId) => void;
}) {
  const material = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: tokens[BASE_TONE[id]].clone(),
        roughness: 0.75,
        metalness: 0.15,
        transparent: true,
        flatShading: false,
      }),
    [id, tokens],
  );
  const refs = React.useRef<(THREE.Group | null)[]>([]);
  const matRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  React.useEffect(() => {
    matRef.current = material;
    return () => material.dispose();
  }, [material]);
  const n = harnessParts.length;

  useFrame((_, dt) => {
    const mat = matRef.current;
    if (!mat) return;
    const t = partAssembly(progressRef.current ?? 0, order, n);
    instances.forEach((inst, i) => {
      const g = refs.current[i];
      if (g) g.position.copy(inst.base).addScaledVector(inst.offset, 1 - t);
    });
    const target = highlight ? tokens.primary : tokens[BASE_TONE[id]];
    const k = Math.min(1, dt * 10);
    mat.color.lerp(target, k);
    mat.emissive.lerp(highlight ? tokens.glowHi : tokens.glow, k);
    mat.opacity += ((anyHighlight && !highlight ? 0.22 : 1) - mat.opacity) * k;
  });

  return (
    <group
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(id);
      }}
      onPointerOut={() => onHover(null)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {instances.map((inst, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={inst.base.clone().add(inst.offset)}
          quaternion={inst.quat}
        >
          {inst.node(material)}
          {i === 0 && (
            <group
              position={[0, 0.42, 0]}
              ref={(el) => {
                anchors.current[id] = el;
              }}
            />
          )}
        </group>
      ))}
    </group>
  );
}

/**
 * Projects each part's label anchor to screen space every frame and moves the DOM label there.
 * Replaces drei <Html>, whose per-label React roots unmount synchronously during render (dev warning).
 */
function LabelProjector({ anchors, place }: { anchors: HarnessSceneAnchors; place: (id: HarnessPartId, x: number, y: number, visible: boolean) => void }) {
  const { camera, size } = useThree();
  const v = React.useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    for (const p of harnessParts) {
      const a = anchors.current[p.id];
      if (!a) continue;
      a.getWorldPosition(v).project(camera);
      place(p.id, ((v.x + 1) / 2) * size.width, ((1 - v.y) / 2) * size.height, v.z <= 1);
    }
  });
  return null;
}

type HarnessSceneAnchors = React.RefObject<Partial<Record<HarnessPartId, THREE.Object3D | null>>>;

function FitCamera() {
  const { camera, size } = useThree();
  React.useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const z = aspect >= 1.3 ? 9.5 : 9.5 * (1.3 / aspect) * 0.92;
    camera.position.set(0, 1.4, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function Rig({ children, idle }: { children: React.ReactNode; idle: boolean }) {
  const ref = React.useRef<THREE.Group>(null);
  const t = React.useRef(0);
  useFrame((_, dt) => {
    if (!ref.current) return;
    if (idle) t.current += dt;
    const target = idle ? Math.sin(t.current * 0.25) * 0.35 : ref.current.rotation.y;
    ref.current.rotation.y += (target - ref.current.rotation.y) * Math.min(1, dt * 2);
  });
  return (
    <group ref={ref} position={[-0.05, 0, 0]}>
      {children}
    </group>
  );
}

/**
 * Frees GPU memory when the canvas unmounts (leaving the section). Geometries built in buildInstances are
 * passed as props, which R3F does not dispose by itself; materials are disposed by Part.
 */
function DisposeOnUnmount() {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  React.useEffect(
    () => () => {
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry?.dispose();
      });
      gl.renderLists.dispose();
    },
    [scene, gl]
  );
  return null;
}

export interface HarnessSceneProps {
  progressRef: React.RefObject<number>;
  /** Part highlighted by scroll (the side panel's current step). */
  activeId: HarnessPartId | null;
  /** Index of the current step; parts with order >= step still show their mono label. */
  step: number;
  hoveredId: HarnessPartId | null;
  onHover: (id: HarnessPartId | null) => void;
  onSelect: (id: HarnessPartId) => void;
  /** Pause rendering (offscreen). */
  paused: boolean;
  /** Allow orbit (disabled on touch so the page keeps scrolling). */
  orbit: boolean;
}

export default function HarnessScene({ progressRef, activeId, step, hoveredId, onHover, onSelect, paused, orbit }: HarnessSceneProps) {
  const theme = useTheme();
  const tokens = React.useMemo(() => readTokens(theme === "light"), [theme]);
  const instances = React.useMemo(() => buildInstances(tokens.canvas), [tokens]);
  const focus = hoveredId ?? activeId;
  const anchors: HarnessSceneAnchors = React.useRef({});
  const labels = React.useRef<Partial<Record<HarnessPartId, HTMLElement | null>>>({});
  const placeLabel = React.useCallback((id: HarnessPartId, x: number, y: number, visible: boolean) => {
    const el = labels.current[id];
    if (!el) return;
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    el.style.visibility = visible ? "visible" : "hidden";
  }, []);

  return (
    <div className="relative size-full">
      <Canvas
        frameloop={paused ? "never" : "always"}
        dpr={[1, 1.75]}
        camera={{ fov: 38, near: 0.1, far: 60, position: [0, 1.4, 9.5] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onPointerMissed={() => onHover(null)}
        style={{ touchAction: orbit ? "none" : "pan-y" }}
      >
        <DisposeOnUnmount />
        <FitCamera />
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <directionalLight position={[-5, -2, -4]} intensity={0.4} />
        <Rig idle={!hoveredId}>
          {harnessParts.map((p, i) => (
            <Part
              key={p.id}
              id={p.id}
              order={i}
              instances={instances[p.id]}
              tokens={tokens}
              progressRef={progressRef}
              highlight={focus === p.id}
              anyHighlight={!!focus}
              anchors={anchors}
              onHover={onHover}
              onSelect={onSelect}
            />
          ))}
        </Rig>
        {orbit && (
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.6}
            minAzimuthAngle={-Math.PI / 2.5}
            maxAzimuthAngle={Math.PI / 2.5}
            target={[0, 0, 0]}
          />
        )}
        <LabelProjector anchors={anchors} place={placeLabel} />
      </Canvas>
      {/* Mono part labels (decorative duplicates of the side list), positioned by LabelProjector. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {harnessParts.map((p, i) => {
          const highlight = focus === p.id;
          const showLabel = i >= step || highlight;
          return (
            <button
              key={p.id}
              ref={(el) => {
                labels.current[p.id] = el;
              }}
              type="button"
              tabIndex={-1}
              onClick={() => onSelect(p.id)}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              className={
                "absolute top-0 left-0 cursor-pointer rounded-sm border px-1.5 py-0.5 t-mono-sm whitespace-nowrap transition-opacity duration-200 " +
                (highlight ? "border-primary bg-primary text-on-primary" : "border-border bg-background text-muted hover:text-on-surface") +
                (showLabel ? " pointer-events-auto opacity-100" : " opacity-0")
              }
              style={{ visibility: "hidden" }}
            >
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
