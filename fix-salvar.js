const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /async function salvar\(emp: Empresa\) \{[\s\S]*?async function salvarEmLote/;

const fixed = "async function salvar(emp: Empresa) {\n" +
"    const sb = supabaseBrowser();\n" +
"    const { data: { user } } = await sb.auth.getUser();\n" +
"    if (!user) return;\n" +
"    const { data, error } = await sb.from('leads').upsert({\n" +
"      user_id: user.id, nome: emp.nome, categoria: emp.categoria, cidade: emp.cidade, pais: emp.pais,\n" +
"      telefone: emp.telefone, website: emp.website, instagram: emp.instagram, email: emp.email,\n" +
"      fonte: engine === 'insta' ? 'instagram' : engine === 'foods' ? 'ifood' : 'osm',\n" +
"      osm_id: emp.osmId, score: emp.score, nivel: emp.nivel\n" +
"    }, { onConflict: 'osm_id', ignoreDuplicates: true }).select('id').maybeSingle();\n" +
"    if (!error) setSalvos((s) => new Set(s).add(emp.osmId));\n" +
"    else setErro(error.message);\n" +
"  }\n\n  async function salvarEmLote";

c = c.replace(regex, fixed);
fs.writeFileSync('app/app/busca/page.tsx', c);
