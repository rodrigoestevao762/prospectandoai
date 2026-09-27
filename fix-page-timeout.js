const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace('demorou mais que 50 segundos', 'demorou mais que 120 segundos');
c = c.replace('levar até 90 segundos', 'levar até 120 segundos');

fs.writeFileSync('app/app/busca/page.tsx', c);
