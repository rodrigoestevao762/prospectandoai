const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const startStr = 'const batchSize = 15; // Acelerado';
const endStr = '          await new Promise(resolve => setTimeout(resolve, 1500));\n      }';

const startIdx = c.indexOf(startStr);
const endIdx = c.indexOf(endStr) + endStr.length;

if (startIdx !== -1 && c.indexOf(endStr) !== -1) {
  const replacement = `for (const l of loteLimitado) {
      setAviso('Enviando e-mail para ' + l.nome + ' (' + (sucessos + 1) + '/' + loteLimitado.length + ')...');
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
      // Delay de segurança de 2 segundos para o Gmail não bloquear a conta por "Too many login attempts"
      await new Promise(r => setTimeout(r, 2000));
    }`;

  c = c.slice(0, startIdx) + replacement + c.slice(endIdx);
  fs.writeFileSync('app/app/page.tsx', c);
  console.log("Success");
} else {
  console.log("Not found");
}
