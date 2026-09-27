const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regexBuscar = /async function buscar\(e: React\.FormEvent\) \{[\s\S]*?catch \(err: any\) \{\s*setCarregando\(false\);\s*setErro\("Falha cr.tica ao conectar com sat.lites: " \+ err\.message\);\s*\}\s*\}/;

const novoBuscar = sync function buscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true); setErro(null); setResultados(null); setSalvos(new Set());
    
    let limitFinal = parseInt(limite) || 1000;

    if (engine === "osint") {
      try {
        const { getCategoria, CATEGORIAS } = await import('@/lib/categorias');
        const { geocodificar, buscarEmpresas } = await import('@/lib/overpass');
        const { qualificar } = await import('@/lib/qualificacao');

        const cat = getCategoria(categoria);
        if (!cidade || (categoria !== "todos" && !cat)) {
          setCarregando(false);
          return setErro("Categoria e cidade obrigatórias");
        }
        
        setErro("Geocodificando cidade... (Buscando coordenadas)");
        const geo = await geocodificar(cidade, pais || undefined);
        if (!geo) {
          setCarregando(false);
          return setErro("Cidade não encontrada no mapa");
        }

        setErro(\Extraindo até \ leads do mapa global... (Isso pode levar de 5 a 50 segundos para cidades grandes, por favor aguarde)\);
        const tags = cat
          ? cat.tags
          : Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
        
        const empresasRaw = await buscarEmpresas(
          cat?.id || "todos", tags, geo.lat, geo.lng, geo.radiusM, cidade, geo.paisNome, undefined, limitFinal
        );
        
        setErro("Qualificando " + empresasRaw.length + " leads encontrados...");
        const empresas = empresasRaw.map((e) => {
          const q = qualificar({ website: e.website, instagram: e.instagram, email: e.email, telefone: e.telefone, endereco: e.endereco });
          return { ...e, score: q.score, nivel: q.nivel };
        });

        empresas.sort((a: any, b: any) => b.score - a.score || a.nome.localeCompare(b.nome));
        
        setResultados(empresas);
        setCarregando(false);
        setErro(null);
        return;
      } catch (err: any) {
        setCarregando(false);
        if (err.message.includes("504") || err.message.includes("TIMEOUT") || err.message.includes("timeout")) {
           return setErro('A região é muito densa e a API Global (Overpass) demorou mais que 50 segundos para responder. Tente reduzir o número de leads MÁX.');
        }
        setErro("Falha crítica ao conectar com satélites do OSINT: " + err.message);
        return;
      }
    }

    let endpoint = "";
    let bodyData: any = { categoria, cidade, pais, limit: limitFinal };

    if (engine === "insta") {
      endpoint = "/api/buscar-insta";
      bodyData = { nicho: nichoInsta, cidade };
    } else if (engine === "foods") {
      endpoint = "/api/buscar-foods";
      bodyData = { nicho: categoria === "todos" ? "restaurante" : categoria, cidade };
    }

    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) }); 
      const text = await res.text(); 
      let json; 
      try { json = JSON.parse(text); } catch (e) { 
        setCarregando(false); 
        if (text.includes('504') || text.includes('TIMEOUT')) { 
          return setErro('Tempo limite excedido no servidor (504).'); 
        } 
        return setErro('Erro no servidor (não retornou JSON). Resposta: ' + text.substring(0, 40)); 
      }
      setCarregando(false);
      
      if (!res.ok) return setErro(json.erro || "Erro na busca");
      
      setResultados(json.empresas || json.resultados || []);
    } catch (err: any) {
      setCarregando(false);
      setErro("Falha crítica ao conectar com satélites: " + err.message);
    }
  };

c = c.replace(regexBuscar, novoBuscar);

fs.writeFileSync('app/app/busca/page.tsx', c);
