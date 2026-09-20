import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');

// Change back to 4000 for strict Vercel compatibility
overpass = overpass.replace(/AbortSignal\.timeout\(8000\)/g, 'AbortSignal.timeout(4000)');

fs.writeFileSync('lib/overpass.ts', overpass);

