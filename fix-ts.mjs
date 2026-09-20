import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');

overpass = overpass.replace(
  'for (const el of json.elements || []) {',
  'for (const el of json?.elements || []) {'
);

fs.writeFileSync('lib/overpass.ts', overpass);

