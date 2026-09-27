const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.split("classificar?: (t: Record<string, string>) => string").join("classificar?: (t: Record<string, string>) => string,\n  limit?: number");
c = c.split("out center 10000;").join("out center ;");

fs.writeFileSync('lib/overpass.ts', c);
