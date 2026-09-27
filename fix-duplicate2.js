const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /async function enriquecerLoteRadar\(\) \{[\s\S]*?\}\n\s*async function enriquecerLoteRadar\(\) \{/;
c = c.replace(regex, 'async function enriquecerLoteRadar() {');

fs.writeFileSync('app/app/busca/page.tsx', c);
