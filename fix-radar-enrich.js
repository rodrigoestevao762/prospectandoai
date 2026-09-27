const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/const r = await fetch\(['"`]\/api\/radar-redes\?q=['"`] \+ q\);/g, 
  `const r = await fetch('/api/enrich-search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nome: emp.nome, cidade: emp.cidade || emp.endereco, pais: emp.pais })
            });`);

c = c.replace(/const json = await r\.json\(\);\n\s*setResultados\(res => res \? res\.map\(e => e\.osmId === emp\.osmId \? { \.\.\.e, instagram: json\.instagram, facebook: json\.facebook, website: json\.website \|\| e\.website, telefone: json\.telefone \|\| e\.telefone } : e\) : null\);/g,
  `const resJson = await r.json();
            if (resJson.success && resJson.data) {
              setResultados(res => res ? res.map(e => e.osmId === emp.osmId ? { 
                ...e, 
                instagram: resJson.data.instagram || e.instagram, 
                facebook: resJson.data.facebook || e.facebook, 
                website: resJson.data.website || e.website, 
                telefone: resJson.data.telefone || e.telefone,
                email: resJson.data.email || e.email
              } : e) : null);
            }`);

fs.writeFileSync('app/app/busca/page.tsx', c);
