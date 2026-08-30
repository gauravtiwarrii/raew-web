"use client";

/**
 * EngineAssembly — the 3D subject of the hero.
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ NEVER RENDERED. `three` resolves to `any` here, so `tsc` validated the    ║
 * ║ React around this and none of the three.js inside it. Geometry argument   ║
 * ║ ORDER is the highest-risk thing in the file — `CylinderGeometry` is       ║
 * ║ (radiusTop, radiusBottom, height, radialSegments) and getting it wrong    ║
 * ║ still produces a shape, just the wrong one. Check the silhouette against  ║
 * ║ `hero/CssEngineVisual.tsx` before adjusting anything else.                ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ── WHAT THIS OBJECT IS, AND WHY IT IS ABSTRACT ───────────────────────────
 * There is no photograph of a RAEW machine and no CAD model of one, and inventing
 * a recognisable "RAEW Rotavator" in 3D would be fabricating a product — the same
 * offence as inventing a specification. So this is deliberately an *abstract
 * precision-machined assembly*: a mounting flange, a bolt circle, a raised boss, a
 * hub and a drive shaft. Generic engineering forms that make no claim about any
 * particular product, while still reading unmistakably as something turned on a
 * lathe rather than a UI shape.
 *
 * Its feature counts come from `hero/CssEngineVisual.tsx` on purpose — 12 mounting
 * lugs at 30°, 6 hub bolts at 60°. The two visuals are the *same object* at
 * different fidelities, so a user who gets the 2D fallback and a user who gets
 * WebGL are looking at one design, not two.
 *
 * ── WHY GEOMETRY IS BUILT IMPERATIVELY, NOT DECLARATIVELY ─────────────────
 * An earlier draft used drei's `<Edges>` helper with a shared `material` prop.
 * That was dropped: whether `<Edges>` forwards a `material` prop (rather than
 * only `color`/`lineWidth`, or a material as children) could not be verified in
 * this environment, and an unverifiable API in the one file that cannot be
 * typechecked is a bad trade. Everything here is now `new THREE.X(...)` —
 * long-stable constructors — so the only remaining risk is argument order, which
 * a single glance at the render will expose.
 *
 * The cost is that R3F does not own any of these objects (it only auto-disposes
 * what it created declaratively), so every geometry and material is disposed by
 * hand on unmount. Skipping that leaks GPU memory on each route change, which is
 * invisible until a long session runs out of it.
 *
 * ── WHY EDGES, NOT `material.wireframe` ───────────────────────────────────
 * `EdgesGeometry` emits only edges where two faces meet above an angle threshold.
 * `wireframe = true` would instead draw every triangle, exposing the cylinder
 * triangulation as a fan of diagonals — a 3D debug view, not an engineering
 * drawing. Edges give clean silhouette-and-crease lines, which is what a CAD
 * wireframe actually looks like.
 *
 * Edges are deliberately omitted on the tori: a 96-segment ring emits a very
 * large number of tiny segments for no gain, since its silhouette is already a
 * circle.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** 12 mounting lugs at 30°, matching CssEngineVisual's MOUNT_ANGLES. */
const LUG_ANGLES = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
/** 6 hub bolts at 60°, matching CssEngineVisual's HUB_BOLTS. */
const BOLT_ANGLES = Array.from({ length: 6 }, (_, i) => (i * Math.PI) / 3);

const LUG_RADIUS = 1.55;
const BOLT_RADIUS = 0.82;
/** Crease angle, in degrees, above which an edge is drawn. */
const EDGE_THRESHOLD = 18;

export type EngineAssemblyProps = {
  /**
   * Blueprint → material, 0..1. Read every frame from a ref rather than passed as
   * a value, so a scroll driver can update it without re-rendering React 60 times
   * a second. 0 is edges only; 1 is solid metal with the edges surviving faintly
   * as a CAD overlay.
   */
  revealRef?: React.RefObject<number>;
};

export default function EngineAssembly({ revealRef }: EngineAssemblyProps) {
  /* Fallback so the component works standalone, with no driver: fully revealed. */
  const internalReveal = useRef(1);
  const reveal = revealRef ?? internalReveal;

  const parts = useMemo(() => {
    const steel = new THREE.MeshStandardMaterial({
      color: "#8b9299",
      metalness: 0.96,
      /* Not 0. A mirror finish with only lightformers to reflect reads as grey
         plastic; a little roughness produces the broad soft highlight that says
         "machined steel". */
      roughness: 0.34,
      envMapIntensity: 1.15,
      transparent: true,
      opacity: 1,
    });

    const line = new THREE.LineBasicMaterial({
      /* --accent-on-dark #34d399, measured at 10.48:1 on the void ground. A
         graphic line here, well past the 3:1 non-text threshold. */
      color: "#34d399",
      transparent: true,
      opacity: 1,
    });

    /* Shared geometries. `lug` and `bolt` are each built once and reused across
       12 and 6 meshes — same draw-call count, a twelfth of the memory. */
    const geo = {
      flange: new THREE.CylinderGeometry(2.05, 2.05, 0.14, 72),
      rim: new THREE.TorusGeometry(2.05, 0.05, 10, 96),
      grooveInner: new THREE.TorusGeometry(1.2, 0.018, 8, 80),
      grooveOuter: new THREE.TorusGeometry(1.85, 0.018, 8, 80),
      boss: new THREE.CylinderGeometry(1.05, 1.05, 0.3, 64),
      hub: new THREE.CylinderGeometry(0.6, 0.6, 0.62, 48),
      cap: new THREE.CylinderGeometry(0.68, 0.68, 0.06, 48),
      shaft: new THREE.CylinderGeometry(0.2, 0.2, 2.4, 32),
      lug: new THREE.BoxGeometry(0.3, 0.16, 0.42),
      bolt: new THREE.CylinderGeometry(0.075, 0.075, 0.12, 12),
    };

    /* Edge sets for the structural parts only. */
    const edges = {
      flange: new THREE.EdgesGeometry(geo.flange, EDGE_THRESHOLD),
      boss: new THREE.EdgesGeometry(geo.boss, EDGE_THRESHOLD),
      hub: new THREE.EdgesGeometry(geo.hub, EDGE_THRESHOLD),
      cap: new THREE.EdgesGeometry(geo.cap, EDGE_THRESHOLD),
      shaft: new THREE.EdgesGeometry(geo.shaft, EDGE_THRESHOLD),
      lug: new THREE.EdgesGeometry(geo.lug, EDGE_THRESHOLD),
      bolt: new THREE.EdgesGeometry(geo.bolt, EDGE_THRESHOLD),
    };

    return { steel, line, geo, edges };
  }, []);

  useEffect(
    () => () => {
      parts.steel.dispose();
      parts.line.dispose();
      for (const g of Object.values(parts.geo)) g.dispose();
      for (const e of Object.values(parts.edges)) e.dispose();
    },
    [parts]
  );

  useFrame(() => {
    const t = Math.min(1, Math.max(0, reveal.current ?? 1));
    parts.steel.opacity = t;
    /* Edges hold full strength through the drawing phase then drop to a quarter,
       so they persist as annotation over the finished material rather than
       vanishing — the drawing does not disappear, it becomes the object. */
    parts.line.opacity = 1 - t * 0.75;
    /* An opacity of exactly 0 still costs a draw call and a depth test. */
    parts.steel.visible = t > 0.01;
    parts.line.visible = parts.line.opacity > 0.01;
  });

  const { steel, line, geo, edges } = parts;

  return (
    /* Outer group: the artistic three-quarter tilt. */
    <group rotation={[0.3, -0.58, 0.07]}>
      {/* Inner group maps the cylinders' native Y axis onto Z so every part below
          can be authored in simple Y-up terms and the assembly still faces the
          camera. A +90° rotation about X sends local +Y to world +Z. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Mounting flange */}
        <group>
          <mesh geometry={geo.flange} material={steel} />
          <lineSegments geometry={edges.flange} material={line} />
        </group>

        {/* Outer rim. Torus is born in the XY plane with its axis on Z, so it
            needs the same +90°-about-X to bring its axis onto local Y. */}
        <mesh
          geometry={geo.rim}
          material={steel}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* Two machined grooves on the flange face */}
        <mesh
          geometry={geo.grooveInner}
          material={steel}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.08, 0]}
        />
        <mesh
          geometry={geo.grooveOuter}
          material={steel}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.08, 0]}
        />

        {/* Raised boss */}
        <group position={[0, 0.2, 0]}>
          <mesh geometry={geo.boss} material={steel} />
          <lineSegments geometry={edges.boss} material={line} />
        </group>

        {/* Hub */}
        <group position={[0, 0.42, 0]}>
          <mesh geometry={geo.hub} material={steel} />
          <lineSegments geometry={edges.hub} material={line} />
        </group>

        {/* Hub cap */}
        <group position={[0, 0.75, 0]}>
          <mesh geometry={geo.cap} material={steel} />
          <lineSegments geometry={edges.cap} material={line} />
        </group>

        {/* Drive shaft, running back away from the viewer */}
        <group position={[0, -1.15, 0]}>
          <mesh geometry={geo.shaft} material={steel} />
          <lineSegments geometry={edges.shaft} material={line} />
        </group>

        {/* 12 mounting lugs around the flange face */}
        {LUG_ANGLES.map((a, i) => (
          <group
            key={`lug-${i}`}
            position={[
              Math.sin(a) * LUG_RADIUS,
              0.15,
              Math.cos(a) * LUG_RADIUS,
            ]}
            rotation={[0, a, 0]}
          >
            <mesh geometry={geo.lug} material={steel} />
            <lineSegments geometry={edges.lug} material={line} />
          </group>
        ))}

        {/* 6 bolts on the boss */}
        {BOLT_ANGLES.map((a, i) => (
          <group
            key={`bolt-${i}`}
            position={[
              Math.sin(a) * BOLT_RADIUS,
              0.38,
              Math.cos(a) * BOLT_RADIUS,
            ]}
          >
            <mesh geometry={geo.bolt} material={steel} />
            <lineSegments geometry={edges.bolt} material={line} />
          </group>
        ))}
      </group>
    </group>
  );
}
