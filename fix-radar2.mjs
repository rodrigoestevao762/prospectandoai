import fs from 'fs';

let enrichment = fs.readFileSync('lib/enrichment.ts', 'utf-8');

const oldFoodsStart = 'export async function radarFoods(nicho: string, cidade: string) {';
const oldFoodsIndex = enrichment.indexOf(oldFoodsStart);

if (oldFoodsIndex !== -1) {
  // We remove everything from oldFoodsStart to the end of the file, because radarFoods is the last function!
  enrichment = enrichment.substring(0, oldFoodsIndex);
  
  const newRadarFoods = `export async function radarFoods(nicho: string, cidade: string) {
  const isGlobal = (cidade.toLowerCase() === "mundial" || cidade.trim() === "");
  const cid = isGlobal ? "" : cidade.trim();
  const nic = nicho.trim() || "restaurante";
  
  const nicExpanded = nic.toLowerCase().includes("restaurante") ? \`\${nic} restaurant\` : 
                      nic.toLowerCase().includes("hamburgueria") ? \`\${nic} burger\` : 
                      nic.toLowerCase().includes("pizzaria") ? \`\${nic} pizzeria\` : nic;

  const overpassPromise = (async () => {
    let leadsOSM: any[] = [];
    try {
      const tags = ["amenity~restaurant|fast_food|cafe|bar", "shop~bakery|pastry", \`name~\${nicExpanded.split(' ')[0]}\`];

      if (isGlobal) {
        const cidades = getRandomCities(3);
        const promessas = cidades.map(async (c) => {
          const geo = await geocodificar(c);
          if (!geo) return [];
          return buscarEmpresas("food", tags, geo.lat, geo.lng, geo.radiusM, c, geo.paisNome);
        });
        const resultados = await Promise.allSettled(promessas);
        for (const r of resultados) {
          if (r.status === "fulfilled") leadsOSM.push(...r.value);
        }
      } else {
        const geo = await geocodificar(cid);
        if (geo) {
          leadsOSM = await buscarEmpresas("food", tags, geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome);
        }
      }
      
      if (leadsOSM.length > 0) {
        return leadsOSM.map(e => ({
          ...e,
          categoria: nicho || "Alimentação",
          cidade: e.cidade || cidade || "Global",
          fonte: "overpass"
        }));
      }
    } catch (error) {}
    return [];
  })();

  const osintPromise = (async () => {
    const base = \`\${nicExpanded} \${cid}\`.trim();
    const baseComAspas = \`\${nicExpanded} \${cid ? \`"\${cid}"\` : ""}\`.trim();

    const searches = await Promise.all([
      searchDuckDuckGo(\`\${baseComAspas} ifood OR ubereats\`),
      searchBing(\`\${baseComAspas} tripadvisor OR yelp\`),
      searchYahoo(\`\${baseComAspas} doordash OR grubhub\`),
      searchQwant(\`\${base} rappi OR zomato\`),
      searchBrave(\`\${base} just-eat OR deliveroo\`),
      searchAsk(\`\${base} restaurant menu delivery ifood\`),
      searchEcosia(\`\${base} ifood tripadvisor ubereats yelp\`)
    ]);

    const htmlUnificado = searches.join(" ");
    const urlsMatches = htmlUnificado.match(/https?:\\/\\/(www\\.)?([a-zA-Z0-9.-]+)\\/([^"'\\s<]+)/gi) || [];

    const dominiosAlvo = ['ifood', 'ubereats', 'glovoapp', 'tripadvisor', 'rappi', 'zomato', 'just-eat', 'doordash', 'deliveroo', 'grubhub', 'yelp'];
    const restaurantes = new Map<string, { nome: string; url: string; fonteStr: string }>();

    for (let link of urlsMatches) {
      try {
        const urlObj = new URL(link);
        const dominio = urlObj.hostname.replace('www.', '');
        if (!dominiosAlvo.some(d => dominio.includes(d))) continue;
        
        let nomeBruto = "";
        let path = urlObj.pathname;
        if (dominio.includes("ifood")) {
          const parts = path.split('/');
          nomeBruto = parts[3] || parts[2] || "";
        } else if (dominio.includes("tripadvisor")) {
          const m = path.match(/Review-[^-]+-[^-]+-(.+?)-/);
          if (m) nomeBruto = m[1];
        } else if (dominio.includes("ubereats")) {
          nomeBruto = path.split('/').pop() || "";
        } else {
          nomeBruto = path.split('/').pop() || "";
        }
        
        nomeBruto = nomeBruto.replace(/[-_.]/g, " ").trim();
        if (nomeBruto.length > 3 && !nomeBruto.includes("search") && !nomeBruto.includes("category")) {
          const key = nomeBruto.toLowerCase();
          if (!restaurantes.has(key)) {
            restaurantes.set(key, { nome: nomeBruto.replace(/\\b\\w/g, l => l.toUpperCase()), url: link, fonteStr: dominio });
          }
        }
      } catch (e) {}
    }

    return Array.from(restaurantes.values()).slice(0, 100).map((r, i) => ({
      osmId: \`osint_food_\${i}\`,
      nome: r.nome,
      categoria: nicho || "Delivery/Restaurante",
      cidade: cidade || "Global",
      pais: "",
      telefone: null,
      website: r.url,
      email: null,
      instagram: null,
      fonte: r.fonteStr,
      score: 60,
      nivel: "quente" as "quente" | "morno" | "frio"
    }));
  })();

  const [overpassResults, osintResults] = await Promise.all([overpassPromise, osintPromise]);

  const map = new Map<string, any>();
  for (const item of [...overpassResults, ...osintResults]) {
    const key = item.nome.toLowerCase();
    if (!map.has(key)) map.set(key, item);
  }

  return Array.from(map.values()).slice(0, 150);
}
`;
  enrichment += newRadarFoods;
  fs.writeFileSync('lib/enrichment.ts', enrichment);
}

