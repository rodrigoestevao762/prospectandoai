const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace('const batchSize = 10; // Reduzido para evitar IP Ban e acelerar resposta real', 'const batchSize = 30; // Acelerado extremo em paralelo');

fs.writeFileSync('app/app/page.tsx', c);
