const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /async function enriquecerLoteRadar\(\) \{[\s\S]*?alert\('Varredura de redes concluda com sucesso!'\);\s*\}/;
c = c.replace(regex, '');

fs.writeFileSync('app/app/busca/page.tsx', c);
