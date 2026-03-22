/**
 * audit-videos.mjs
 * Checks every YouTube video ID in src/data/composers.js via the oEmbed API.
 *
 * Results:
 *   ✅  HTTP 200  — embeddable, should work
 *   ❌  HTTP 401  — embedding disabled by video owner
 *   ❌  HTTP 404  — video deleted or private
 *   ❌  other     — unexpected error
 *
 * Run: node scripts/audit-videos.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const composersPath = join(__dirname, '../src/data/composers.js');
const src = readFileSync(composersPath, 'utf8');

// Extract all v(title, youtubeId, ...) calls
const vRegex = /v\(\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([A-Za-z0-9_-]{11})['"`]/g;
const entries = [];
let m;
while ((m = vRegex.exec(src)) !== null) {
  entries.push({ title: m[1], youtubeId: m[2] });
}

// Deduplicate by ID (but track all titles that share an ID)
const byId = new Map();
for (const { title, youtubeId } of entries) {
  if (!byId.has(youtubeId)) byId.set(youtubeId, []);
  byId.get(youtubeId).push(title);
}

console.log(`Found ${entries.length} video entries (${byId.size} unique IDs). Checking…\n`);

const broken = [];
const ok = [];

let done = 0;
const total = byId.size;

async function check(youtubeId, titles) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      ok.push({ youtubeId, titles, ytTitle: data.title });
    } else {
      broken.push({ youtubeId, titles, status: res.status, reason: res.status === 401 ? 'embedding disabled' : res.status === 404 ? 'not found / private' : `HTTP ${res.status}` });
    }
  } catch (e) {
    broken.push({ youtubeId, titles, status: 'ERR', reason: e.message });
  }
  done++;
  process.stdout.write(`\r  ${done}/${total}`);
}

// Run in batches of 10 to avoid hammering the API
const ids = [...byId.entries()];
const BATCH = 10;
for (let i = 0; i < ids.length; i += BATCH) {
  await Promise.all(ids.slice(i, i + BATCH).map(([id, titles]) => check(id, titles)));
}

console.log('\n');

if (broken.length === 0) {
  console.log('🎉 All videos are embeddable!');
} else {
  console.log(`❌ BROKEN (${broken.length} IDs):\n`);
  for (const { youtubeId, titles, reason } of broken) {
    console.log(`  ${youtubeId}  [${reason}]`);
    for (const t of titles) console.log(`    · ${t}`);
  }
  console.log(`\n✅ OK: ${ok.length} IDs embeddable`);
  console.log(`❌ Broken: ${broken.length} IDs need replacement`);

  console.log('\n--- Copy-paste replacements needed ---');
  for (const { youtubeId, titles, reason } of broken) {
    console.log(`\n// ${reason}: ${youtubeId}`);
    for (const t of titles) {
      console.log(`// "${t}" — find a new YouTube ID for this piece`);
    }
  }
}
