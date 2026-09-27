const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace('const batchSize = 5;', 'const batchSize = 15;');

fs.writeFileSync('app/app/page.tsx', c);
