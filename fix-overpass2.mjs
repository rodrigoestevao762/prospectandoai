import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');

overpass = overpass.replace('await new Promise((r) => setTimeout(r, 1500));', '// no sleep in serverless');
overpass = overpass.replace('for (const url of OVERPASS_ENDPOINTS) {', 'for (const url of OVERPASS_ENDPOINTS.slice(0, 2)) {');
overpass = overpass.replace(/AbortSignal\.timeout\(5000\)/g, 'AbortSignal.timeout(4000)');

fs.writeFileSync('lib/overpass.ts', overpass);

