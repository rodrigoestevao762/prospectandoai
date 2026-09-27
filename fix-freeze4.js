const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const target = `        await Promise.all(lote.map(async (l) => {
          setOcupado(l.id + ":auto");
          try {
            const res = await fetch("/api/enviar-automatico", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: l.id }),
            });
            const json = await res.json();
            if (res.ok) {
              setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
              await atualizar(l.id, { status: 'enviado', canal: 'email' });
                sucessos++;
                localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());
            } else {
              ultErro = json.erro || "Erro desconhecido";
            }
          } catch (err) {
            console.error(err);
          }
          setOcupado(null);
        }));`;

const repl = `        await Promise.all(lote.map(async (l) => {
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
        await new Promise(resolve => setTimeout(resolve, 1500)); // Delay gigante para dar fôlego ao servidor`;

c = c.split(target.replace(/\r\n/g, '\n')).join(repl);
c = c.split(target).join(repl); // try both

fs.writeFileSync('app/app/page.tsx', c);
