const fs = require('fs');

let c = fs.readFileSync('lib/overpass.ts', 'utf8');
c = c.replace(/\[timeout:120\]/g, '[timeout:25]');
c = c.replace(/AbortSignal\.timeout\(125000\)/g, 'AbortSignal.timeout(28000)');
fs.writeFileSync('lib/overpass.ts', c);

let out = fs.readFileSync('lib/outscraper.ts', 'utf8');
out = out.replace(/AbortSignal\.timeout\(50000\)/g, 'AbortSignal.timeout(25000)');
fs.writeFileSync('lib/outscraper.ts', out);
