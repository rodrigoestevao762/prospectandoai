const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex2 = /const res = await fetch\("\/api\/enrich-search"[\s\S]*?const json = await res\.json\(\);/;
const replacement2 = "const res = await fetch('/api/enrich-search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: emp.nome, cidade: emp.cidade, pais: emp.pais }) }); const text = await res.text(); let json = {}; try { json = JSON.parse(text); } catch { console.error('Enrich error:', text); }";

c = c.replace(regex2, replacement2);
fs.writeFileSync('app/app/busca/page.tsx', c);
