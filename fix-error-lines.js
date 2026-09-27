const fs = require('fs');
let lines = fs.readFileSync('app/app/page.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Falha no disparo!') && lines[i].includes('ultErro')) {
    lines[i] = '        setAviso(ultErro ? `Falha no disparo! Erro: ${ultErro}` : `Nenhum e-mail foi enviado neste lote. Todos foram retidos pelo filtro Anti-Bounce (lixo).`);';
  }
}

fs.writeFileSync('app/app/page.tsx', lines.join('\n'));
