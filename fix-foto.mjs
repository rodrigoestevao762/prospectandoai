import fs from 'fs';
let c = fs.readFileSync('lib/foto-scraper.ts', 'utf-8');
c = c.replace(/\\`/g, '`');
fs.writeFileSync('lib/foto-scraper.ts', c);
