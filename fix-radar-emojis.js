const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/\?\? QUENTES/g, "?? QUENTES");
c = c.replace(/\?\? MORNOS/g, "? MORNOS");
c = c.replace(/\?\? FRIOS/g, "?? FRIOS");

fs.writeFileSync('app/app/busca/page.tsx', c);
