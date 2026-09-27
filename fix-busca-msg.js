const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace('Isso pode levar de 5 a 50 segundos', 'Isso pode levar até 90 segundos');

fs.writeFileSync('app/app/busca/page.tsx', c);
