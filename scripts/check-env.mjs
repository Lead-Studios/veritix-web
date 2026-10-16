#!/usr/bin/env node

/**
 * CI guard: compares .env.example keys against variables consumed by the
 * codebase. Fails if any consumed variable is missing from .env.example.
 *
 * Usage:  node scripts/check-env.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC_DIR = join(import.meta.dirname, "..", "src");
const ENV_EXAMPLE = join(import.meta.dirname, "..", ".env.example");

// ── 1. Collect all env vars referenced in source code ─────────────────────────
const consumed = new Set();
const SEARCH_RE = /process\.env\.([A-Z_][A-Z0-9_]*)/g;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    const ext = full.split(".").pop();
    if (!["ts", "tsx", "js", "jsx", "mjs"].includes(ext)) continue;
    const src = readFileSync(full, "utf8");
    let m;
    while ((m = SEARCH_RE.exec(src)) !== null) {
      consumed.add(m[1]);
    }
  }
}
walk(SRC_DIR);

// ── 2. Parse .env.example keys ────────────────────────────────────────────────
const exampleSrc = readFileSync(ENV_EXAMPLE, "utf8");
const documented = new Set();
for (const line of exampleSrc.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const key = trimmed.split("=")[0]?.trim();
  if (key) documented.add(key);
}

// ── 3. Diff ───────────────────────────────────────────────────────────────────
const missing = [...consumed].filter((k) => !documented.has(k));

if (missing.length > 0) {
  console.error(
    `\n❌  The following env vars are consumed but missing from .env.example:\n` +
      missing.map((k) => `   - ${k}`).join("\n") +
      "\n\nPlease document them in .env.example with a comment, type, and example value.\n",
  );
  process.exit(1);
}

console.log("✅  All consumed env vars are documented in .env.example.");
