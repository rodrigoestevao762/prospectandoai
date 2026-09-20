import fs from 'fs';

let content = fs.readFileSync('app/api/gerar-landing/route.ts', 'utf-8');

const replacement = `// Tenta pegar a foto real via API interna
    let fotoReal = "";
    if (!instrucaoCustomizada) {
      try {
        const query = \`"\${lead.nome}" em \${lead.cidade}\`;
        fotoReal = \`\${req.headers.get("origin") || "https://hardz-leads.vercel.app"}/api/foto-maps?q=\${encodeURIComponent(query)}\`;
      } catch (e) {
        console.error("Erro ao gerar URL da foto", e);
      }
    }`;

content = content.replace(/\/\/ Tenta pegar a foto real via Outscraper[\s\S]*?\}\n    \}/, replacement);

fs.writeFileSync('app/api/gerar-landing/route.ts', content);

