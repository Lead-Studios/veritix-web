#!/usr/bin/env node

/**
 * Check the route budgets documented in BUNDLE_BUDGET.md.
 *
 * The analyzer is a visualization tool; this gate reads the production build
 * manifest so a PR cannot quietly add a large initial chunk. It intentionally
 * fails when the manifest is absent rather than treating a missing build as a
 * successful check.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const KIB = 1024;
const LIMITS = {
  '/dashboard': 150 * KIB,
  '/verify': 120 * KIB,
  '/events/create': 130 * KIB,
};
const SHARED_LIMIT = 80 * KIB;
const BUILD_DIR = resolve('.next');
const MANIFEST_PATH = resolve(BUILD_DIR, 'app-build-manifest.json');

function readManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`Bundle budget check requires a production build: ${MANIFEST_PATH} is missing.`);
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

function pageEntries(manifest) {
  return manifest.pages ?? manifest.appBuildManifest?.pages ?? manifest;
}

function routeCandidates(route) {
  const normalized = route === '/' ? '/' : route.replace(/\/$/, '');
  return [normalized, `${normalized}/page`, normalized === '/page' ? '/' : `/${normalized.slice(1)}/page`];
}

function chunksForRoute(pages, route) {
  for (const candidate of routeCandidates(route)) {
    if (Array.isArray(pages[candidate])) return pages[candidate];
  }
  return null;
}

function chunkPath(chunk) {
  return resolve(BUILD_DIR, chunk.replace(/^\/+/, ''));
}

function gzipSize(chunks) {
  return [...new Set(chunks)].reduce((total, chunk) => {
    const path = chunkPath(chunk);
    if (!existsSync(path)) throw new Error(`Build manifest references a missing chunk: ${path}`);
    return total + gzipSync(readFileSync(path)).byteLength;
  }, 0);
}

function formatKib(bytes) {
  return `${(bytes / KIB).toFixed(1)} KiB`;
}

const manifest = readManifest();
const pages = pageEntries(manifest);
const sharedChunks = [...(manifest.rootMainFiles ?? []), ...(manifest.polyfillFiles ?? [])];
const results = [];
const failures = [];

for (const [route, limit] of Object.entries(LIMITS)) {
  const chunks = chunksForRoute(pages, route);
  if (!chunks) {
    failures.push(`${route}: no route entry in app-build-manifest.json`);
    results.push({ route, actual: 'missing', limit: formatKib(limit), status: 'FAIL' });
    continue;
  }
  const actual = gzipSize(chunks);
  const failed = actual > limit;
  if (failed) failures.push(`${route}: ${formatKib(actual)} exceeds ${formatKib(limit)}`);
  results.push({ route, actual: formatKib(actual), limit: formatKib(limit), status: failed ? 'FAIL' : 'ok' });
}

const shared = gzipSize(sharedChunks);
if (shared > SHARED_LIMIT) failures.push(`shared chunks: ${formatKib(shared)} exceeds ${formatKib(SHARED_LIMIT)}`);
results.push({ route: 'shared chunks', actual: formatKib(shared), limit: formatKib(SHARED_LIMIT), status: shared > SHARED_LIMIT ? 'FAIL' : 'ok' });

console.table(results);
if (failures.length > 0) {
  throw new Error(`Bundle budget exceeded:\n- ${failures.join('\n- ')}`);
}
console.log('All documented JavaScript budgets are within limits.');
