const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regexLoopEmail = /await Promise\.all\(lote\.map\(async \(l\) => \{[\s\S]*?setOcupado\(null\);\n\s*\}\)\);/g;
const replacementLoopEmail = wait Promise.all(lote.map(async (l) => {
          try {
            const res = await fetch("/api/enviar-automatico", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: l.id }),
            });
            const json = await res.json();
            if (res.ok) {
              await atualizar(l.id, { status: 'enviado', canal: 'email' });
              sucessos++;
              localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());
            } else {
              ultErro = json.erro || "Erro desconhecido";
            }
          } catch (err) {
            console.error(err);
          }
        }));
        await new Promise(resolve => setTimeout(resolve, 800)); // Delay para no travar o navegador;

c = c.replace(regexLoopEmail, replacementLoopEmail);

fs.writeFileSync('app/app/page.tsx', c);
