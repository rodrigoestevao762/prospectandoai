const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /const res = await fetch\(endpoint[\s\S]*?const json = await res\.json\(\);/;
const replacement = "const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) }); const text = await res.text(); let json; try { json = JSON.parse(text); } catch (e) { setCarregando(false); if (text.includes('504') || text.includes('TIMEOUT') || text.includes('error o')) { return setErro('Tempo limite excedido na varredura. A região é muito grande ou os servidores demoraram a responder (504).'); } return setErro('Erro no servidor (não retornou JSON). Resposta original: ' + text.substring(0, 40) + '...'); }";

c = c.replace(regex, replacement);
fs.writeFileSync('app/app/busca/page.tsx', c);
