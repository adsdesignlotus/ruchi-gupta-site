/**
 * Non-blocking hint when local Node is outside the supported dev band.
 * See package.json "engines" and .nvmrc — Vercel serverless uses Node 18.
 */
const v = process.version;
const ok = v.startsWith("v18") || v.startsWith("v20");
if (!ok) {
  console.warn(
    "\n[ruchi-gupta-site] Recommended Node.js: 18.x or 20.x (see .nvmrc and package.json engines).",
    `\n              Current: ${v}. Vercel builds use Node 18 — matching locally avoids subtle mismatches.\n`,
  );
}
