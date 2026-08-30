/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SANDBOX-ONLY JSX SHIM — DELETE THIS FILE AFTER `npm install`
 * ════════════════════════════════════════════════════════════════════════════
 *
 * The other half of `sandbox-shims.d.ts`. Read that file's header first; it
 * explains why these two are separate and why both must be deleted once the
 * real packages are installed.
 *
 * React Three Fiber ships an augmentation of `React.JSX.IntrinsicElements` that
 * teaches TSX about `<mesh>`, `<meshStandardMaterial>` and the rest. Shimming
 * the package as `any` throws that augmentation away with it, so without the
 * block below every 3D element is an "unknown JSX element" error.
 *
 * This lists ONLY the elements this codebase actually uses, rather than a
 * `[key: string]: any` catch-all. That restraint is the point: a catch-all
 * would also silence a genuine typo like `<dvi>` or `<sectoin>` in ordinary
 * markup across the whole project, quietly removing a real safety net for the
 * sake of the 3D layer. If a new R3F element is introduced, add it here and
 * accept the small friction.
 *
 * React 19 removed the global `JSX` namespace, so the augmentation target is
 * `React.JSX`, reached by augmenting the "react" module. The `export {}` below
 * is load-bearing — it is what makes this file a module, which is what makes
 * `declare module "react"` an augmentation rather than a replacement.
 */

export {};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /* Scene graph */
      primitive: any;
      group: any;
      mesh: any;
      instancedMesh: any;
      points: any;
      lineSegments: any;

      /* Lights */
      ambientLight: any;
      hemisphereLight: any;
      directionalLight: any;
      spotLight: any;
      pointLight: any;

      /* Materials */
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      lineBasicMaterial: any;
      pointsMaterial: any;
      shadowMaterial: any;

      /* Geometry */
      bufferGeometry: any;
      bufferAttribute: any;
      boxGeometry: any;
      cylinderGeometry: any;
      torusGeometry: any;
      sphereGeometry: any;
      ringGeometry: any;
      circleGeometry: any;
      planeGeometry: any;
      edgesGeometry: any;
      extrudeGeometry: any;
      latheGeometry: any;

      /* Scene attributes */
      color: any;
      fog: any;
      fogExp2: any;
    }
  }
}
