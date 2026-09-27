const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /async function salvarEmLote\(nivel\?: "quente" \| "morno" \| "frio"\) \{[\s\S]*?setCarregando\(false\);\s*\}/;

const newSalvarEmLote = "async function salvarEmLote(nivel?: 'quente' | 'morno' | 'frio') {\n" +
"    if (!resultados) return;\n" +
"    let lista = somenteInstagram ? resultados.filter(e => e.instagram) : resultados;\n" +
"    if (nivel) lista = lista.filter(e => e.nivel === nivel);\n" +
"    const naoSalvos = lista.filter(e => !salvos.has(e.osmId));\n" +
"    if (naoSalvos.length === 0) return;\n" +
"    setCarregando(true);\n" +
"    const sb = supabaseBrowser();\n" +
"    const { data: { user } } = await sb.auth.getUser();\n" +
"    if (!user) return setCarregando(false);\n" +
"    const chunkSize = 500;\n" +
"    for (let i = 0; i < naoSalvos.length; i += chunkSize) {\n" +
"      const pedaco = naoSalvos.slice(i, i + chunkSize);\n" +
"      const rows = pedaco.map(emp => ({\n" +
"        user_id: user.id, nome: emp.nome, categoria: emp.categoria, cidade: emp.cidade, pais: emp.pais,\n" +
"        telefone: emp.telefone, website: emp.website, instagram: emp.instagram, email: emp.email,\n" +
"        fonte: engine === 'insta' ? 'instagram' : engine === 'foods' ? 'ifood' : 'osm',\n" +
"        osm_id: emp.osmId, score: emp.score, nivel: emp.nivel,\n" +
"      }));\n" +
"      const { error } = await sb.from('leads').insert(rows);\n" +
"      if (!error) {\n" +
"        setSalvos(s => {\n" +
"          const ns = new Set(s);\n" +
"          pedaco.forEach(emp => ns.add(emp.osmId));\n" +
"          return ns;\n" +
"        });\n" +
"      } else {\n" +
"        console.error('Erro ao salvar lote:', error);\n" +
"      }\n" +
"    }\n" +
"    setCarregando(false);\n" +
"  }";

c = c.replace(regex, newSalvarEmLote);
fs.writeFileSync('app/app/busca/page.tsx', c);
