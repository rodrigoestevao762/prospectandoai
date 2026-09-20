import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');
overpass = overpass.replace(/signal: AbortSignal\.timeout\(\d+\)/g, '');
// Clean up trailing commas or spaces if needed, but since it's inside an object, removing it might leave `{ headers: {},  }` which is valid JS/TS.
// Let's be safe and just replace it with an empty comment or remove the key.
overpass = overpass.replace(/,\s*signal:\s*AbortSignal\.timeout\(\d+\)/g, '');
fs.writeFileSync('lib/overpass.ts', overpass);

let enrichment = fs.readFileSync('lib/enrichment.ts', 'utf-8');
enrichment = enrichment.replace(/,\s*signal:\s*AbortSignal\.timeout\(\d+\)/g, '');
fs.writeFileSync('lib/enrichment.ts', enrichment);
