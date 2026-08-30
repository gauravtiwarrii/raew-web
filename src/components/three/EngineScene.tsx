"use client";

/**
 * EngineScene — the R3F canvas, its lighting rig, and the machinery that keeps it
 * from costing anything when nobody is looking at it.
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ NEVER RENDERED. `three`, `@react-three/fiber` and `@react-three/drei`     ║
 * ║ all resolve to `any`, so nothing below is typechecked. Most likely to be  ║
 * ║ wrong, in order:                                                          ║
 * ║   1. `<Environment>` accepting `<Lightformer>` children with `resolution` ║
 * ║      and no `preset`/`files`. This is the asset-free path and the whole   ║
 * ║      reason the metal has anything to reflect — see the note below.       ║
 * ║   2. `<ContactShadows>` prop names (`opacity`, `blur`, `far`, `scale`).   ║
 * ║   3. Whether changing `frameloop` on a live `<Canvas>` is honoured.       ║
 * ║      If it is not, the IntersectionObserver saving does nothing and the   ║
 * ║      scene renders continuously — correct, just wasteful.                 ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ── WHY THE ENVIRONMENT IS BUILT FROM LIGHTFORMERS, NOT A PRESET ──────────
 * `<Environment preset="warehouse" />` is the obvious choice and is wrong here.
 * The presets are fetched at runtime from a CDN (pmndrs market-assets), which
 * means: a multi-megabyte HDRI on the critical path, a hard third-party
 * dependency for the hero to look right, a blank scene on any offline or
 * firewalled network, and a `next dev` session that silently differs from
 * production. Building the environment from `<Lightformer>` planes instead is
 * entirely local — it renders a tiny cube map from geometry we describe — so the
 * metal has broad shapes to reflect with no download at all.
 *
 * This matters more than it sounds: a `metalness: 0.96` material with no
 * environment reflects nothing and renders as flat grey. The lightformers ARE the
 * material's appearance, not an enhancement to it.
 *
 * ── THE LIGHTING IS A THREE-POINT RIG, DELIBERATELY ───────────────────────
 * Key from upper-front-right, a cool low fill from the opposite side to keep the
 * shadow side readable rather than black, and a rim from behind to separate the
 * silhouette from the near-black ground. The green accent is a single low-
 * intensity point light — enough to tie the object to the brand, kept well below
 * the key so it reads as a coloured bounce off something off-camera rather than as
 * neon. No saturated magenta/cyan pair, no rainbow: that is the gaming look the
 * brief rules out.
 *
 * ── WHY `frameloop` IS GATED ON VISIBILITY ────────────────────────────────
 * A continuously rendering PBR canvas is the single largest battery and thermal
 * cost on the page, and the hero scrolls out of view within one viewport. So the
 * loop runs only while the canvas actually intersects the viewport AND the tab is
 * visible; otherwise it is `"never"` and the GPU is idle. This is also what keeps
 * the scene from competing with the scroll-driven sections further down the page
 * for frame budget.
 *
 * `"demand"` was considered and rejected: the reveal and camera are scrubbed by
 * scroll, so frames are needed continuously *while in view* anyway, and
 * `"demand"` would mean an `invalidate()` call on every scroll event to achieve
 * the same thing with more moving parts.
 */

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import EngineAssembly from "./EngineAssembly";

export type EngineSceneProps = {
  /** Blueprint → material, 0..1, read per frame. See EngineAssembly. */
  revealRef?: React.RefObject<number>;
  /**
   * Camera dolly, 0..1, read per frame. 0 is the establishing framing; 1 is
   * pushed in and levelled off. Driven by scroll in the hero — a ref rather
   * than a prop so the scrub does not re-render React sixty times a second.
   */
  dollyRef?: React.RefObject<number>;
};

/** Rest position of the camera, and the distance the dolly travels from it. */
const CAMERA_REST = { y: 0.55, z: 6.4 };
const DOLLY_TRAVEL = { y: -0.34, z: -1.25 };

/**
 * CameraRig — the only thing that moves the camera.
 *
 * Renders nothing; it exists because `<Canvas camera={{…}}>` sets the *initial*
 * framing and R3F then owns the object, so animating it means reaching for it
 * from inside the tree rather than re-passing a prop (which would recreate the
 * camera and reset the projection).
 *
 * `lookAt` is called every frame rather than once at setup. It is one matrix
 * composition, and it is what turns the dolly into a real camera move: as `y`
 * drops toward the object's centreline the framing levels off, the way a jib
 * settles at the end of a push-in. Setting `position` alone would keep the
 * original downward tilt and read as a zoom.
 */
function CameraRig({ dollyRef }: { dollyRef?: React.RefObject<number> }) {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const t = Math.min(1, Math.max(0, dollyRef?.current ?? 0));
    camera.position.y = CAMERA_REST.y + DOLLY_TRAVEL.y * t;
    camera.position.z = CAMERA_REST.z + DOLLY_TRAVEL.z * t;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function EngineScene({ revealRef, dollyRef }: EngineSceneProps) {

  const holder = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    let inView = false;
    const sync = () => setRunning(inView && !document.hidden);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      /* A little margin so the loop is already warm by the time the canvas is
         actually on screen — starting it at the exact boundary shows one frame of
         un-rendered canvas. */
      { rootMargin: "120px 0px", threshold: 0 }
    );
    io.observe(el);

    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div
      ref={holder}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <Canvas
        frameloop={running ? "always" : "never"}
        /* Clamped, not `window.devicePixelRatio`. A 3× phone or a 5K display
           would otherwise render 9–25× the pixels of a 1× screen for a difference
           nobody can see on a dark metallic object. 1.75 keeps edges clean on a
           2× display while capping the fill cost. */
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          /* The canvas sits over the hero's own dark background and grain, so the
             scene must not paint its own opaque ground. */
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.55, 6.4], fov: 32, near: 0.1, far: 40 }}
      >
        {/* Atmospheric haze. Matched to --cinema-void #070707 so the object
            dissolves into the section background rather than into a visible
            rectangle of fog. */}
        <fog attach="fog" args={["#070707", 7, 17]} />

        {/* ── Three-point rig ── */}
        {/* Fill: low, cool, keeps the shadow side from going to pure black. */}
        <hemisphereLight args={["#9fb4c7", "#0b0d0c", 0.32]} />
        {/* Key: upper front right. */}
        <directionalLight position={[4.2, 5.4, 4.8]} intensity={2.1} color="#ffffff" />
        {/* Rim: behind and slightly below, separating the silhouette. */}
        <spotLight
          position={[-4.5, 2.2, -5.5]}
          angle={0.8}
          penumbra={1}
          intensity={3.4}
          color="#dbeafe"
        />
        {/* Brand bounce. --accent-bright #059669, kept at low intensity: a hint
            of green in the shadow side, not a neon wash. */}
        <pointLight position={[-2.6, -1.4, 2.4]} intensity={1.5} color="#059669" distance={9} />

        {/* Local, asset-free environment — see header. These planes exist only to
            be reflected in the metal; they are never seen directly. */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={1.5}
            position={[0, 4, 3]}
            scale={[8, 3, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="rect"
            intensity={0.7}
            position={[-5, 0.5, 1]}
            scale={[3, 6, 1]}
            rotation={[0, Math.PI / 2, 0]}
            color="#b6c9dd"
          />
          <Lightformer
            form="rect"
            intensity={0.55}
            position={[5, 0, -1]}
            scale={[3, 6, 1]}
            rotation={[0, -Math.PI / 2, 0]}
            color="#8fa3b5"
          />
          {/* A long thin former reads on curved metal as a machine-shop strip
              light — the highlight that makes a turned surface look turned. */}
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[1.5, 2.5, -3]}
            scale={[0.4, 7, 1]}
            color="#ffffff"
          />
        </Environment>

        <EngineAssembly revealRef={revealRef} />

        {/* Grounds the object. Cheaper than a shadow-mapped light — which is why
            `shadows` is NOT enabled on the Canvas: a full shadow map for one
            contact shadow would be a second render pass for no visible gain. */}
        <ContactShadows
          position={[0, -2.15, 0]}
          opacity={0.55}
          scale={11}
          blur={2.6}
          far={4.5}
          resolution={512}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
