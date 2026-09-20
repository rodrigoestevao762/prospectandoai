import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');
// Remove AbortSignal
overpass = overpass.replace(/,\s*signal:\s*AbortSignal\.timeout\(\d+\)\s*(?=\})?/g, '');
// Change 15000 to 3000
overpass = overpass.replace(/out center 15000;/g, 'out center 3000;');
fs.writeFileSync('lib/overpass.ts', overpass);

let enrichment = fs.readFileSync('lib/enrichment.ts', 'utf-8');
enrichment = enrichment.replace(/,\s*signal:\s*AbortSignal\.timeout\(\d+\)\s*(?=\})?/g, '');
fs.writeFileSync('lib/enrichment.ts', enrichment);

