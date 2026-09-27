const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regex = /const ids = paraExcluir\.map\(l => l\.id\);\s*await sb\.from\("leads"\)\.delete\(\)\.in\("id", ids\);/;
const repl = const ids = paraExcluir.map(l => l.id);
      
      // Delete in batches of 50 to avoid URL too long issues
      for (let i = 0; i < ids.length; i += 50) {
        const lote = ids.slice(i, i + 50);
        await sb.from("leads").delete().in("id", lote);
      };

c = c.replace(regex, repl);
fs.writeFileSync('app/app/page.tsx', c);
