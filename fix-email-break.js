const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(
  /ultErro = err\.message \|\| "Erro desconhecido";\s*}\s*setOcupado\(null\);\s*\/\/ Delay de seguran/g,
  `ultErro = err.message || "Erro desconhecido";
      }
      setOcupado(null);
      if (ultErro && (ultErro.includes('Too many login attempts') || ultErro.includes('Invalid login') || ultErro.includes('535'))) break;
      // Delay de seguran`
);

fs.writeFileSync('app/app/page.tsx', c);
