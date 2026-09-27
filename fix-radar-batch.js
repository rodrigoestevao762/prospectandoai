const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace('const batchSize = 10;', 'const batchSize = 30;');

fs.writeFileSync('app/app/busca/page.tsx', c);
