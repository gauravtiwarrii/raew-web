/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SANDBOX-ONLY TYPE SHIMS — DELETE THIS FILE AFTER `npm install`
 * ════════════════════════════════════════════════════════════════════════════
 *
 * WHY THIS EXISTS
 *
 * The 3D and scroll layers of this site import `three`, `@react-three/fiber`,
 * `@react-three/drei`, `gsap` and `lenis`. Those packages are declared in
 * package.json but were NOT installable in the environment the code was
 * written in (network egress returns HTTP 403 for the npm registry). Without
 * some stand-in, `tsc --noEmit` fails with "Cannot find module 'three'" on
 * every 3D file, which takes away the only working verification tool in that
 * environment for the *entire* codebase — including the ~95% of it that has
 * nothing to do with 3D.
 *
 * These shorthand ambient declarations make those five packages resolve as
 * `any`, so the rest of the codebase stays typecheckable.
 *
 * ── WHAT THIS DOES NOT DO ────────────────────────────────────────────────────
 *
 * Be clear-eyed about the cost. Because every import from these packages is
 * `any`, TypeScript CANNOT catch:
 *   • a misspelled drei component or a prop that does not exist on one
 *   • a wrong argument count or order in a three.js constructor
 *   • a GSAP tween property that is not animatable
 *   • a renamed API between three revisions
 * Those classes of error will surface at runtime, in the browser, on first
 * render. The 3D files are the ones to read most carefully in review.
 *
 * ── HOW TO REMOVE IT ─────────────────────────────────────────────────────────
 *
 *   1. npm install       (installs three, R3F, drei, gsap, lenis, @types/three)
 *   2. delete this file AND `sandbox-jsx.d.ts`
 *   3. npx tsc --noEmit  ← now a REAL check of the 3D code, against real types
 *
 * Step 3 is the one that matters and it can only happen on a machine where the
 * install succeeds. Expect it to surface errors; that is the point of it.
 *
 * Leaving this file in place after installing is actively harmful: a shorthand
 * ambient declaration shadows the real package types, so the 3D layer would
 * silently stay untyped forever. It needs no wiring — the include globs in
 * tsconfig.json already pick up every .ts file in the project, so this one
 * takes effect just by existing.
 *
 * (Those globs are deliberately not written out here. A star-slash sequence
 * inside a block comment closes the comment — spelling the pattern out is what
 * broke this file on its first compile, and it is worth not repeating.)
 *
 * ── WHY THE JSX HALF LIVES IN A SEPARATE FILE ────────────────────────────────
 *
 * R3F's JSX intrinsics (`<mesh>`, `<meshStandardMaterial>`) need an
 * augmentation of `React.JSX.IntrinsicElements`, and that CANNOT go in this
 * file. TypeScript only treats `declare module "x" { … }` as an *augmentation*
 * when the containing file is itself a module — i.e. has a top-level
 * import/export. This file has neither, by necessity: the shorthand form
 * `declare module "three";` is only legal in a global script file. So in here,
 * `declare module "react" { … }` would declare a brand-new ambient module named
 * "react" that SHADOWS `@types/react` outright, turning every React type in the
 * project into an error. The two halves are therefore split, and
 * `sandbox-jsx.d.ts` carries an `export {}` to make itself a module.
 */

/* Shorthand ambient modules: every import shape (default, named, namespace)
   resolves to `any`. One line each is deliberately all that is here — writing
   speculative fake signatures would be worse than `any`, because a wrong
   signature produces confident errors about an API that does not exist. */
declare module "three";
declare module "@react-three/fiber";
declare module "@react-three/drei";
declare module "gsap";
declare module "gsap/ScrollTrigger";
declare module "lenis";

