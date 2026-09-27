const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/encodeURIComponent\(l\.nome \+ " " \+ \(l\.endereco \|\| l\.cidade\)\)/g, 'encodeURIComponent(l.nome + " " + l.cidade)');

fs.writeFileSync('app/app/page.tsx', c);
