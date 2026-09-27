const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/\\n/g, '\n');

fs.writeFileSync('app/app/page.tsx', c);
