const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/await Promise\.all\(lote\.map\(async \(l\) => \{\s*setOcupado\(l\.id \+ ":auto"\);\s*try \{\s*const res = await fetch\("\/api\/enviar-automatico"[\s\S]*?setOcupado\(null\);\s*\}\)\);/g,
"await Promise.all(lote.map(async (l) => {\\n          try {\\n            const res = await fetch('/api/enviar-automatico', {\\n              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: l.id }),\\n            });\\n            const json = await res.json();\\n            if (res.ok) {\\n              await atualizar(l.id, { status: 'enviado', canal: 'email' });\\n              sucessos++;\\n              localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());\\n            } else {\\n              ultErro = json.erro || 'Erro desconhecido';\\n            }\\n          } catch (err) {\\n            console.error(err);\\n          }\\n        }));\\n        await new Promise(resolve => setTimeout(resolve, 1500));");

fs.writeFileSync('app/app/page.tsx', c);
