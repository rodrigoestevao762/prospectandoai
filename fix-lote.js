const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /async function salvarEmLote\(nivel\?: "quente" \| "morno" \| "frio"\) \{[\s\S]*?setCarregando\(false\);\s*\}/;

const newSalvarEmLote = sync function salvarEmLote(nivel?: "quente" | "morno" | "frio") {
    if (!resultados) return;
    let lista = somenteInstagram ? resultados.filter(e => e.instagram) : resultados;
    if (nivel) lista = lista.filter(e => e.nivel === nivel);
    
    const naoSalvos = lista.filter(e => !salvos.has(e.osmId));
    if (naoSalvos.length === 0) return;
    
    setCarregando(true);
    const sb = supabaseBrowser();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return setCarregando(false);
    
    // Inserção em Lote (Chunking) para evitar Rate Limit e lentidão com milhares de leads
    const chunkSize = 500;
    for (let i = 0; i < naoSalvos.length; i += chunkSize) {
      const pedaco = naoSalvos.slice(i, i + chunkSize);
      const rows = pedaco.map(emp => ({
        user_id: user.id, nome: emp.nome, categoria: emp.categoria, cidade: emp.cidade, pais: emp.pais,
        telefone: emp.telefone, website: emp.website, instagram: emp.instagram, email: emp.email,
        fonte: engine === "insta" ? "instagram" : engine === "foods" ? "ifood" : "osm",
        osm_id: emp.osmId, score: emp.score, nivel: emp.nivel,
      }));
      
      const { error } = await sb.from("leads").insert(rows);
      if (!error) {
        setSalvos(s => {
          const ns = new Set(s);
          pedaco.forEach(emp => ns.add(emp.osmId));
          return ns;
        });
      } else {
        console.error("Erro ao salvar lote:", error);
      }
    }
    setCarregando(false);
  };

c = c.replace(regex, newSalvarEmLote);
fs.writeFileSync('app/app/busca/page.tsx', c);
