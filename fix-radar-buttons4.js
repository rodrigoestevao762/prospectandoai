const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/<Save className="w-3 h-3" \/> SALVAR TUDO[\r\n\s]*<\/button>/g, 
  '<Save className="w-3 h-3" /> SALVAR TUDO\n' +
'                    </button>\n' +
'                    <button onClick={() => salvarEmLote("quente")} disabled={carregando || !resultados.some(e => e.nivel === "quente" && !salvos.has(e.osmId))}\n' +
'                      className="btn-3d bg-[#ff5d5d]/10 hover:bg-[#ff5d5d]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#ff5d5d]">\n' +
'                      ?? QUENTES\n' +
'                    </button>\n' +
'                    <button onClick={() => salvarEmLote("morno")} disabled={carregando || !resultados.some(e => e.nivel === "morno" && !salvos.has(e.osmId))}\n' +
'                      className="btn-3d bg-[#ffb02d]/10 hover:bg-[#ffb02d]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#ffb02d]">\n' +
'                      ? MORNOS\n' +
'                    </button>\n' +
'                    <button onClick={() => salvarEmLote("frio")} disabled={carregando || !resultados.some(e => e.nivel === "frio" && !salvos.has(e.osmId))}\n' +
'                      className="btn-3d bg-[#55685f]/10 hover:bg-[#55685f]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#55685f]">\n' +
'                      ?? FRIOS\n' +
'                    </button>\n' +
'                    <div className="w-px h-4 bg-white/10 mx-1"></div>\n' +
'                    <button onClick={enriquecerLoteRadar} disabled={carregando || checando !== null}\n' +
'                      className="btn-3d bg-purple-500/10 hover:bg-purple-500/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-purple-400">\n' +
'                      <Search className="w-3 h-3" /> ENRIQUECER LOTE\n' +
'                    </button>');

if (!c.includes('enriquecerLoteRadar()')) {
const targetFunc = "async function salvarEmLote";
const replFunc = "async function enriquecerLoteRadar() {\n" +
"    if (!resultados) return;\n" +
"    const semRedes = resultados.filter(e => !e.instagram);\n" +
"    if (semRedes.length === 0) return alert('Nenhum lead precisa de enriquecimento (ou todos já têm redes).');\n" +
"    if (!confirm('Deseja acionar a varredura profunda para buscar redes sociais de ' + semRedes.length + ' empresas ao vivo? Isso pode demorar vários minutos se a lista for muito grande!')) return;\n" +
"    \n" +
"    setChecando('all');\n" +
"    const batchSize = 10;\n" +
"    for (let i = 0; i < semRedes.length; i += batchSize) {\n" +
"      const lote = semRedes.slice(i, i + batchSize);\n" +
"      await Promise.all(lote.map(async (emp) => {\n" +
"        try {\n" +
"          const q = encodeURIComponent(emp.nome + ' ' + (emp.endereco || emp.cidade));\n" +
"          const r = await fetch('/api/radar-redes?q=' + q);\n" +
"          if (r.ok) {\n" +
"            const json = await r.json();\n" +
"            setResultados(res => res ? res.map(e => e.osmId === emp.osmId ? { ...e, instagram: json.instagram, facebook: json.facebook, website: json.website || e.website, telefone: json.telefone || e.telefone } : e) : null);\n" +
"          }\n" +
"        } catch (e) {}\n" +
"      }));\n" +
"    }\n" +
"    setChecando(null);\n" +
"    alert('Varredura de redes concluída com sucesso!');\n" +
"  }\n\n  async function salvarEmLote";
c = c.replace(targetFunc, replFunc);
}

fs.writeFileSync('app/app/busca/page.tsx', c);
