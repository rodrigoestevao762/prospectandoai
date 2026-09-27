const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/\{l\.email \? \(/g, "{ (l.email && !l.email.includes('duckduckgo.com')) ? (");

fs.writeFileSync('app/app/page.tsx', c);
