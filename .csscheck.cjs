/**
 * Structural CSS validator. Run from the repo root so `postcss` resolves
 * (a script in /tmp cannot: MODULE_NOT_FOUND).
 *
 *   node .csscheck.cjs && rm .csscheck.cjs
 *
 * Three checks, in order of how badly the failure would hide:
 *   1. PostCSS parse — catches the unterminated-comment class of error, which
 *      leaves prose sitting in CSS scope and which tsc can never see.
 *   2. Comment pairing and brace balance on the raw source, walked token by
 *      token, as a cross-check on (1).
 *   3. `var(--x)` references with no definition anywhere in the file, minus a
 *      known-external allowlist (next/font injects three) and any that supply
 *      a fallback.
 */
const fs = require("fs");
const postcss = require("postcss");

const FILE = "src/app/globals.css";
const css = fs.readFileSync(FILE, "utf8");
let failed = false;
const fail = (m) => { failed = true; console.log("FAIL " + m); };

/* ── 1. Parse ── */
try {
  postcss.parse(css, { from: FILE });
  console.log("OK   postcss parse");
} catch (e) {
  fail("postcss parse: " + e.message);
}

/* ── 2. Comments and braces ── */
const opens = (css.match(/\/\*/g) || []).length;
const closes = (css.match(/\*\//g) || []).length;
if (opens !== closes) fail(`comment pairing: ${opens} /* vs ${closes} */`);
else console.log(`OK   comments balanced (${opens} pairs)`);

/* Brace balance must be measured on comment-stripped source: a `{` inside a
   comment is not a block. */
const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
const ob = (stripped.match(/\{/g) || []).length;
const cb = (stripped.match(/\}/g) || []).length;
if (ob !== cb) fail(`brace balance: ${ob} { vs ${cb} }`);
else console.log(`OK   braces balanced (${ob})`);

/* ── 3. Undefined custom properties ── */
const EXTERNAL = new Set(["--font-inter", "--font-grotesk", "--font-mono-technical"]);
const defined = new Set();
for (const m of stripped.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) defined.add(m[1]);

const missing = new Map();
/* Match var(--x) and capture whether a comma follows inside the parens, which
   is what distinguishes "has a fallback" from "must resolve". */
for (const m of stripped.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)\s*(,?)/g)) {
  const [, name, comma] = m;
  if (comma === "," || defined.has(name) || EXTERNAL.has(name)) continue;
  missing.set(name, (missing.get(name) || 0) + 1);
}
if (missing.size) {
  for (const [name, n] of missing) fail(`undefined var ${name} (${n}×, no fallback)`);
} else {
  console.log(`OK   all var() refs resolve (${defined.size} defined)`);
}

console.log(failed ? "\nCSSCHECK_FAILED" : "\nCSSCHECK_PASSED");
process.exit(failed ? 1 : 0);
