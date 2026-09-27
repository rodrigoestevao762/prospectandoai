const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

c = c.replace('AbortSignal.timeout(40000)', 'AbortSignal.timeout(10000)');

fs.writeFileSync('lib/enrichment.ts', c);
