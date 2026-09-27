const fs = require('fs');
let lines = fs.readFileSync('app/app/page.tsx', 'utf8').split('\n');

let start = -1;
let end = -1;

for (let i=0; i<lines.length; i++) {
  if (lines[i].includes('const batchSize = 15; // Acelerado') && lines[i].includes('let ultErro')) {
    // Wait, let ultErro is before
  }
  if (lines[i].includes('const batchSize = 15; // Acelerado')) {
    start = i;
  }
  if (start !== -1 && i > start && lines[i].includes('if (sucessos > 0) {') && lines[i-1].includes('setOcupado(null);')) {
    end = i - 2;
    break;
  }
}

console.log(start, end);

if (start !== -1 && end !== -1) {
  lines.splice(start, end - start + 1, 
    `for (const l of loteLimitado) {`,
    `      setAviso('Enviando e-mail para ' + l.nome + ' (' + (sucessos + 1) + '/' + loteLimitado.length + ')...');`,
    `      setOcupado(l.id + ":email");`,
    `      try {`,
    `        const res = await fetch('/api/enviar-automatico', {`,
    `          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: l.id }),`,
    `        });`,
    `        const json = await res.json();`,
    `        if (res.ok) {`,
    `          setLeads((ls) => ls.map((lead) => (lead.id === l.id ? { ...lead, status: 'enviado', canal: 'email', atualizado_em: new Date().toISOString() } : lead)));`,
    `          sucessos++;`,
    `          localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());`,
    `        } else {`,
    `          ultErro = json.erro;`,
    `        }`,
    `      } catch (err: any) {`,
    `        ultErro = err.message || "Erro desconhecido";`,
    `      }`,
    `      setOcupado(null);`,
    `      // Delay de segurança de 2 segundos para o Gmail não bloquear a conta por "Too many login attempts"`,
    `      await new Promise(r => setTimeout(r, 2000));`,
    `    }`
  );
  fs.writeFileSync('app/app/page.tsx', lines.join('\n'));
  console.log("Success");
}
