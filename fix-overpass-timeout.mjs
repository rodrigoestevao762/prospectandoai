import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');

// 1. Increase timeout to 8 seconds in Nominatim, and catch it to return null
overpass = overpass.replace(
  'const res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" }, signal: AbortSignal.timeout(4000) });',
  `let res;
    try {
      res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" }, signal: AbortSignal.timeout(8000) });
    } catch (err) {
      return null;
    }`
);

// 2. Increase timeout to 8 seconds in Overpass, and let the existing try/catch handle it (it already catches to try the next endpoint)
overpass = overpass.replace(/AbortSignal\.timeout\(4000\)/g, 'AbortSignal.timeout(8000)');

fs.writeFileSync('lib/overpass.ts', overpass);
