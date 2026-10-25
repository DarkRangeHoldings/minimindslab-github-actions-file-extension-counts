import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

const payload = JSON.parse(payloadRaw);

if (!payload || typeof payload !== 'object' || !Array.isArray(payload.paths)) {
  throw new Error('Invalid input');
}

const paths = payload.paths.slice();
for (let i = 0; i < paths.length; i++) {
  if (typeof paths[i] !== 'string') throw new Error('Invalid input');
}

const counts = Object.create(null);

for (let i = 0; i < paths.length; i++) {
  const p = paths[i];
  const lastSlash = p.lastIndexOf('/');
  const name = lastSlash === -1 ? p : p.slice(lastSlash + 1);
  const dot = name.lastIndexOf('.');
  const ext = dot > 0 ? name.slice(dot) : '<none>';
  counts[ext] = (counts[ext] || 0) + 1;
}

const extensions = Object.keys(counts).sort();
const sortedCounts = Object.create(null);
for (let i = 0; i < extensions.length; i++) {
  const ext = extensions[i];
  sortedCounts[ext] = counts[ext];
}

const result = {
  counts: sortedCounts,
  extensions,
  total: paths.length
};

appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);