const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace("classificar?: (t: Record<string, string>) => string", "classificar?: (t: Record<string, string>) => string,\n  limit?: number");
c = c.replace("out center 10000;;", "out center ;;");

fs.writeFileSync('lib/overpass.ts', c);
