const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.split('limit?: number').join('limit?: number,\n  bbox?: number[]');

fs.writeFileSync('lib/overpass.ts', c);
