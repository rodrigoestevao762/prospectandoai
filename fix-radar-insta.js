const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

c = c.replace(/\[\.\.\.cat\.tags, "AND:contact:instagram"\]/g, 'cat.tags');
c = c.replace(/\[\`name~\$\{nic\},i\`, "AND:contact:instagram"\]/g, '[`name~${nic},i`]');

fs.writeFileSync('lib/enrichment.ts', c);
