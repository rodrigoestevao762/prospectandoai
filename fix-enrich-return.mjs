import fs from 'fs';

let content = fs.readFileSync('lib/enrichment.ts', 'utf-8');

const newEnrichLeadData = `export async function enrichLeadData(nome: string, cidade: string, pais: string = "") {
  const safeNome = nome.replace(/['"]/g, "");
  
  const searches = await Promise.all([
    searchDuckDuckGo(\`"\${safeNome}" \${cidade} contato email\`),
    searchBing(\`"\${safeNome}" \${cidade} @gmail.com\`),
    searchYahoo(\`site:instagram.com "\${safeNome}" \${cidade}\`),
    searchQwant(\`site:facebook.com "\${safeNome}" \${cidade}\`),
    searchBrave(\`"\${safeNome}" \${cidade} email contato\`),
    searchAsk(\`"\${safeNome}" \${cidade} instagram facebook email\`),
    searchEcosia(\`"\${safeNome}" \${cidade} contato\`)
  ]);
  
  const htmlUnificado = searches.join(" ");

  const emails = htmlUnificado.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}/g) || [];
  const instas = htmlUnificado.match(/instagram\\.com\\/([A-Za-z0-9_.]+)/gi) || [];
  const faces = htmlUnificado.match(/facebook\\.com\\/([A-Za-z0-9_.]+)/gi) || [];
  
  return {
    email: emails.length > 0 ? emails[0].toLowerCase() : null,
    instagram: instas.length > 0 ? \`https://www.\${instas[0].toLowerCase()}\` : null,
    facebook: faces.length > 0 ? \`https://www.\${faces[0].toLowerCase()}\` : null,
    fontes: ['duckduckgo', 'bing', 'yahoo', 'qwant', 'brave', 'ask', 'ecosia']
  };
}`;

const regex = /export async function enrichLeadData[\s\S]*?return \{\s*email[\s\S]*?\};\s*\}/;
content = content.replace(regex, newEnrichLeadData);

fs.writeFileSync('lib/enrichment.ts', content);
