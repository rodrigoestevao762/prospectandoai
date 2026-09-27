const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/await Promise\.all\(lote\.map\(async \(l\) => \{\s*setOcupado\(l\.id \+ ":auto"\);\s*try \{\s*const res = await fetch\("\/api\/enviar-automatico"[\s\S]*?setOcupado\(null\);\s*\}\)\);/g,
\wait Promise.all(lote.map(async (l) => {
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
        await new Promise(resolve => setTimeout(resolve, 1500));\);

fs.writeFileSync('app/app/page.tsx', c);
