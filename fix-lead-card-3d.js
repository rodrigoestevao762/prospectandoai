const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

// 1. Remover o "quadrado estranho"
const regex = /{[^}]*FOTO E MAPS \(Lado Esquerdo\)[^}]*}[\s\S]*?<div className="w-24 md:w-32 flex-shrink-0 flex flex-col gap-2 relative">[\s\S]*?<\/div>\s*<\/div>\s*<div className="flex-1 min-w-0 flex flex-col">/;

c = c.replace(regex, '<div className="flex-1 min-w-0">');
c = c.replace(/className="lead-card p-4 flex gap-4 relative group"/, 'className="lead-card p-4 flex gap-4"');

// 2. Inserir o botão 3D estiloso de volta no painel de botões
const botoesRegex = /<button onClick=\{\(\) => router\.push\(\`\/app\/editor\/\$\{l\.id\}\`\)\} className="btn-3d btn-3d-amber">/;
const novoBotao = `<a href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(l.nome + " " + l.cidade)}\`} target="_blank" rel="noopener noreferrer" 
                 className="btn-3d" style={{ background: 'var(--signal)', color: '#000', boxShadow: '0 4px 0 #0284c7, 0 8px 24px rgba(56,189,248,0.4)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                VER NO MAPS
              </a>
              <button onClick={() => router.push(\`/app/editor/\${l.id}\`)} className="btn-3d btn-3d-amber">`;

c = c.replace(botoesRegex, novoBotao);

fs.writeFileSync('app/app/page.tsx', c);
