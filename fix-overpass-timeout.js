const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace('AbortSignal.timeout(50000)', 'AbortSignal.timeout(90000)');

fs.writeFileSync('lib/overpass.ts', c);
