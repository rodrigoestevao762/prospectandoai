const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

c = c.replace(/export async function enrichLeadData[\s\S]*?const htmlUnificado = searches\.join/g, (match) => {
  return `export async function enrichLeadData(nome: string, cidade: string, pais: string = "") {
  const safeNome = nome.replace(/['"]/g, "");
  
  const searchesResult = await Promise.allSettled([
    searchDuckDuckGo(\`"\${safeNome}" \${cidade} contato email\`),
    searchBing(\`"\${safeNome}" \${cidade} @gmail.com\`),
    searchYahoo(\`site:instagram.com "\${safeNome}" \${cidade}\`),
    searchQwant(\`site:facebook.com "\${safeNome}" \${cidade}\`),
    searchBrave(\`"\${safeNome}" \${cidade} email contato\`),
    searchAsk(\`"\${safeNome}" \${cidade} instagram facebook email\`),
    searchEcosia(\`"\${safeNome}" \${cidade} contato\`)
  ]);
  const searches = searchesResult.map((r: any) => r.status === 'fulfilled' ? r.value : "");
  
  const htmlUnificado = searches.join`;
});

c = c.replace(/export async function radarInstagram[\s\S]*?const htmlUnificado = searches\.join/g, (match) => {
  let m2 = match.replace(/const searchesResult[\s\S]*?\]\);/, `const searchesResult = await Promise.allSettled([
        searchDuckDuckGo(\`\${baseComAspas} "instagram.com"\`),
        searchBing(\`\${baseComAspas} instagram\`),
        searchYahoo(\`\${baseComAspas} instagram oficial\`),
        searchQwant(\`\${base} instagram profile\`),
        searchBrave(\`\${base} instagram.com\`),
        searchAsk(\`\${base} instagram page\`),
        searchEcosia(\`\${base} instagram.com\`)
      ]);`);
  return m2;
});

c = c.replace(/export async function radarFoods[\s\S]*?const htmlUnificado = searches\.join/g, (match) => {
  let m2 = match.replace(/const searchesResult[\s\S]*?\]\);/, `const searchesResult = await Promise.allSettled([
        searchDuckDuckGo(\`\${baseComAspas} ifood OR ubereats\`),
        searchBing(\`\${baseComAspas} tripadvisor OR yelp\`),
        searchYahoo(\`\${baseComAspas} doordash OR grubhub\`),
        searchQwant(\`\${base} rappi OR zomato\`),
        searchBrave(\`\${base} just-eat OR deliveroo\`),
        searchAsk(\`\${base} restaurant menu delivery ifood\`),
        searchEcosia(\`\${base} ifood tripadvisor ubereats yelp\`)
      ]);`);
  return m2;
});

fs.writeFileSync('lib/enrichment.ts', c);
