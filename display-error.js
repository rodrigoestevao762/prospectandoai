const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /\} else \{\n\s*console\.error\('Erro ao salvar lote:', error\);\n\s*\}/g;
const replacement = "} else { setErro('ERRO DB: ' + error.code + ' - ' + error.message); break; }";
c = c.replace(regex, replacement);

fs.writeFileSync('app/app/busca/page.tsx', c);
