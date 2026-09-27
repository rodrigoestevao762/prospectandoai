const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

// Remove photo logic
c = c.replace(/let fotoUrl: string \| null = null;[\s\S]*?className=\adge \$\{est\.badge\}\\>/, 'className=adge >');
c = c.replace(/<div className=\"shrink-0 mt-1\">[\s\S]*?<\/div>\s*<div className=\"flex-1 min-w-0\">\s*\{\/\* Header do card \*\/\}/, '<div className=\"flex-1 min-w-0\">\n            {/* Header do card */}');

// Limit emails logic
const regexDisparo = /async function disparoEmLote\(\) \{[\s\S]*?let sucessos = 0;/;
const replacementDisparo = "async function disparoEmLote() {\n" +
"    const hoje = new Date().toLocaleDateString('pt-BR');\n" +
"    const storageKey = 'emails_sent_' + hoje;\n" +
"    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);\n" +
"    \n" +
"    if (enviadosHoje >= 450) {\n" +
"      return setAviso('Limite diário de 450 envios atingido por hoje. Não enviaremos mais e-mails para proteger sua conta contra spam.');\n" +
"    }\n" +
"\n" +
"    const paraEnviar = visiveis.filter(l => \n" +
"      l.email && \n" +
"      !l.email.includes('duckduckgo.com') && \n" +
"      ['novo', 'mensagem_gerada'].includes(l.status)\n" +
"    );\n" +
"    \n" +
"    if (paraEnviar.length === 0) return setAviso('Nenhum lead com e-mail válido disponível para envio.');\n" +
"    \n" +
"    const qtdPermitida = 450 - enviadosHoje;\n" +
"    const loteLimitado = paraEnviar.slice(0, qtdPermitida);\n" +
"\n" +
"    if (!confirm('Você já enviou ' + enviadosHoje + ' e-mails hoje. Deseja disparar e-mails para mais ' + loteLimitado.length + ' leads simultaneamente (Limite: 450/dia)?')) return;\n" +
"    \n" +
"    let sucessos = 0;";
c = c.replace(regexDisparo, replacementDisparo);

const regexLoopEmLote = /await atualizar\(l\.id, \{ status: "enviado", canal: "email" \}\);\s*sucessos\+\+;/;
const replacementLoopEmLote = "await atualizar(l.id, { status: 'enviado', canal: 'email' });\n" +
"              sucessos++;\n" +
"              localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());";
c = c.replace(regexLoopEmLote, replacementLoopEmLote);

const regexEnviarAuto = /async function enviarAuto\(l: Lead\) \{[\s\S]*?const res = await fetch\("\/api\/enviar-automatico"/;
const replacementEnviarAuto = "async function enviarAuto(l: Lead) {\n" +
"    const hoje = new Date().toLocaleDateString('pt-BR');\n" +
"    const storageKey = 'emails_sent_' + hoje;\n" +
"    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);\n" +
"    \n" +
"    if (enviadosHoje >= 450) {\n" +
"      return setAviso('Limite diário de 450 envios atingido por hoje. Não enviaremos mais e-mails para proteger sua conta contra spam.');\n" +
"    }\n" +
"\n" +
"    setOcupado(l.id + ':auto'); setAviso(null);\n" +
"    const res = await fetch('/api/enviar-automatico'";
c = c.replace(regexEnviarAuto, replacementEnviarAuto);

const regexEnviarAutoEnd = /await atualizar\(l\.id, \{ status: "enviado", canal: "email" \}\);\s*setAviso\(/;
const replacementEnviarAutoEnd = "await atualizar(l.id, { status: 'enviado', canal: 'email' });\n" +
"    localStorage.setItem(storageKey, (enviadosHoje + 1).toString());\n" +
"    setAviso(";
c = c.replace(regexEnviarAutoEnd, replacementEnviarAutoEnd);

// Fix the loop variables for bulk send
c = c.replace(/for \(let i = 0; i < paraEnviar\.length; i \+= batchSize\) \{/, "for (let i = 0; i < loteLimitado.length; i += batchSize) {");
c = c.replace(/const lote = paraEnviar\.slice\(i, i \+ batchSize\);/, "const lote = loteLimitado.slice(i, i + batchSize);");
// Safely replace the aviso interpolation string
const targetStr = 'setAviso(Enviando e-mails turbo... (/));';
const replStr = 'setAviso(Enviando e-mails turbo... (/));';
c = c.split(targetStr).join(replStr);

fs.writeFileSync('app/app/page.tsx', c);
