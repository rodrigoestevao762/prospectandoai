import fs from 'fs';

let content = fs.readFileSync('lib/enrichment.ts', 'utf-8');

content = content.replace('emails[0].toLowerCase()', 'emails[0]?.toLowerCase()');
content = content.replace('instas[0].toLowerCase()', 'instas[0]?.toLowerCase()');
content = content.replace('faces[0].toLowerCase()', 'faces[0]?.toLowerCase()');

fs.writeFileSync('lib/enrichment.ts', content);

