const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

c = c.replace(/"AND:contact:instagram~\."/g, '"AND:contact:instagram"');

fs.writeFileSync('lib/enrichment.ts', c);
