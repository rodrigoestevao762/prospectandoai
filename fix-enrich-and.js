const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

c = c.replace(/"contact:instagram~\."/g, '"AND:contact:instagram~."');
c = c.replace(/"delivery~yes\|only"/g, '"AND:delivery~yes|only"');

fs.writeFileSync('lib/enrichment.ts', c);
