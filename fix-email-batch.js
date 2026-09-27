const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/const batchSize = 15; \/\/ Acelerado[\s\S]*?await new Promise\(r => setTimeout\(r, 100\)\);\n      }/, 
`for (const l of loteLimitado) {
        setAviso('Enviando e-mail para ' + l.nome + '...');
        setOcupado(l.id + ":email");
        try {
          const res = await fetch('/api/enviar-automatico', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: l.id }),
          });
          const json = await res.json();
          if (res.ok) {
            setLeads((ls) => ls.map((lead) => (lead.id === l.id ? { ...lead, status: 'enviado', canal: 'email', atualizado_em: new Date().toISOString() } : lead)));
            sucessos++;
            localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());
          } else {
            ultErro = json.erro;
          }
        } catch (err: any) {
          ultErro = err.message || "Erro desconhecido";
        }
        setOcupado(null);
        // Delay de segurança para o Gmail não bloquear por "Too many logins"
        await new Promise(r => setTimeout(r, 1500));
      }`);

fs.writeFileSync('app/app/page.tsx', c);
