const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regexDisparo = /async function disparoEmLote\(\) \{[\s\S]*?let sucessos = 0;/;
const replacementDisparo = sync function disparoEmLote() {
    const hoje = new Date().toLocaleDateString("pt-BR");
    const storageKey = 'emails_sent_' + hoje;
    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    if (enviadosHoje >= 450) {
      return setAviso("Limite diário de 450 envios atingido por hoje. Não enviaremos mais e-mails para proteger sua conta contra spam.");
    }

    const paraEnviar = visiveis.filter(l => 
      l.email && 
      !l.email.includes("duckduckgo.com") && 
      ["novo", "mensagem_gerada"].includes(l.status)
    );
    
    if (paraEnviar.length === 0) return setAviso("Nenhum lead com e-mail válido disponível para envio.");
    
    const qtdPermitida = 450 - enviadosHoje;
    const loteLimitado = paraEnviar.slice(0, qtdPermitida);

    if (!confirm(\Você já enviou \ e-mails hoje. Deseja disparar e-mails para mais \ leads simultaneamente (Limite: 450/dia)?\)) return;
    
    let sucessos = 0;;

c = c.replace(regexDisparo, replacementDisparo);

const regexLoopEmLote = /await atualizar\(l\.id, \{ status: "enviado", canal: "email" \}\);\s*sucessos\+\+;/;
const replacementLoopEmLote = wait atualizar(l.id, { status: "enviado", canal: "email" });
              sucessos++;
              localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());;

c = c.replace(regexLoopEmLote, replacementLoopEmLote);

const regexEnviarAuto = /async function enviarAuto\(l: Lead\) \{[\s\S]*?const res = await fetch\("\/api\/enviar-automatico"/;
const replacementEnviarAuto = sync function enviarAuto(l: Lead) {
    const hoje = new Date().toLocaleDateString("pt-BR");
    const storageKey = 'emails_sent_' + hoje;
    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    if (enviadosHoje >= 450) {
      return setAviso("Limite diário de 450 envios atingido por hoje. Não enviaremos mais e-mails para proteger sua conta contra spam.");
    }

    setOcupado(l.id + ":auto"); setAviso(null);
    const res = await fetch("/api/enviar-automatico";

c = c.replace(regexEnviarAuto, replacementEnviarAuto);

const regexEnviarAutoEnd = /await atualizar\(l\.id, \{ status: "enviado", canal: "email" \}\);\s*setAviso\(/;
const replacementEnviarAutoEnd = wait atualizar(l.id, { status: "enviado", canal: "email" });
    localStorage.setItem(storageKey, (enviadosHoje + 1).toString());
    setAviso(;

c = c.replace(regexEnviarAutoEnd, replacementEnviarAutoEnd);

fs.writeFileSync('app/app/page.tsx', c);
