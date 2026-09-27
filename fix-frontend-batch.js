const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regex = /for \(const l of loteLimitado\) {[\s\S]*?\/\/ Delay de seguran.+?\n\s*await new Promise\(r => setTimeout\(r, 2000\)\);\n\s*}/;

const replacement = `const BATCH_SIZE = 30; // 30 e-mails por ciclo
      for (let i = 0; i < loteLimitado.length; i += BATCH_SIZE) {
        const loteIds = loteLimitado.slice(i, i + BATCH_SIZE).map(l => l.id);
        setAviso('Disparando lote de e-mails turbo (' + Math.min(i + BATCH_SIZE, loteLimitado.length) + '/' + loteLimitado.length + ')...');
        setOcupado("enviando_lote");
        
        try {
          const res = await fetch('/api/enviar-lote', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadIds: loteIds }),
          });
          const json = await res.json();
          if (res.ok) {
            const sucessosLote = json.sucessos || 0;
            sucessos += sucessosLote;
            localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());
            
            setLeads((ls) => ls.map((lead) => {
              const result = json.resultados?.find((r: any) => r.id === lead.id);
              if (result && result.ok) return { ...lead, status: 'enviado', canal: 'email', atualizado_em: new Date().toISOString() };
              return lead;
            }));
          } else {
            ultErro = json.erro;
          }
        } catch (err: any) {
          ultErro = err.message || "Erro desconhecido";
        }
        
        setOcupado(null);
        if (ultErro && (ultErro.includes('Too many login attempts') || ultErro.includes('Invalid login') || ultErro.includes('535'))) break;
      }`;

if (regex.test(c)) {
  c = c.replace(regex, replacement);
  fs.writeFileSync('app/app/page.tsx', c);
  console.log("Success");
} else {
  console.log("Not found");
}
