const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace('Leds Mx', 'MÁX LEADS');
fs.writeFileSync('app/app/busca/page.tsx', c);
