const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const targetButtons = \<button onClick={() => salvarEmLote()} disabled={carregando || (somenteInstagram ? resultados.filter(e => e.instagram) : resultados).every(e => salvos.has(e.osmId))}
                      className="btn-3d bg-white/10 hover:bg-white/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-white">
                      <Save className="w-3 h-3" /> SALVAR TUDO
                    </button>\;

const replButtons = \<button onClick={() => salvarEmLote()} disabled={carregando || (somenteInstagram ? resultados.filter(e => e.instagram) : resultados).every(e => salvos.has(e.osmId))}
                      className="btn-3d bg-white/10 hover:bg-white/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-white">
                      <Save className="w-3 h-3" /> SALVAR TUDO
                    </button>
                    <button onClick={() => salvarEmLote('quente')} disabled={carregando || !resultados.some(e => e.nivel === 'quente' && !salvos.has(e.osmId))}
                      className="btn-3d bg-[#ff5d5d]/10 hover:bg-[#ff5d5d]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#ff5d5d]">
                      ?? QUENTES
                    </button>
                    <button onClick={() => salvarEmLote('morno')} disabled={carregando || !resultados.some(e => e.nivel === 'morno' && !salvos.has(e.osmId))}
                      className="btn-3d bg-[#ffb02d]/10 hover:bg-[#ffb02d]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#ffb02d]">
                      ? MORNOS
                    </button>
                    <button onClick={() => salvarEmLote('frio')} disabled={carregando || !resultados.some(e => e.nivel === 'frio' && !salvos.has(e.osmId))}
                      className="btn-3d bg-[#55685f]/10 hover:bg-[#55685f]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#55685f]">
                      ?? FRIOS
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <button onClick={enriquecerLoteRadar} disabled={carregando || checando !== null}
                      className="btn-3d bg-purple-500/10 hover:bg-purple-500/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-purple-400">
                      <Search className="w-3 h-3" /> ENRIQUECER LOTE
                    </button>\;

c = c.split(targetButtons).join(replButtons);

const targetFunc = "async function salvarEmLote";
const replFunc = \sync function enriquecerLoteRadar() {
    if (!resultados) return;
    const semRedes = resultados.filter(e => !e.instagram);
    if (semRedes.length === 0) return alert("Nenhum lead visível precisa de enriquecimento (ou todos já têm redes).");
    if (!confirm(\\\Deseja acionar a varredura profunda para buscar redes sociais de \\\ empresas ao vivo? Isso pode demorar vários minutos se a lista for muito grande!\\\)) return;
    
    setChecando('all');
    const batchSize = 10;
    for (let i = 0; i < semRedes.length; i += batchSize) {
      const lote = semRedes.slice(i, i + batchSize);
      await Promise.all(lote.map(async (emp) => {
        try {
          const q = encodeURIComponent(emp.nome + " " + (emp.endereco || emp.cidade));
          const r = await fetch("/api/radar-redes?q=" + q);
          if (r.ok) {
            const json = await r.json();
            setResultados(res => res ? res.map(e => e.osmId === emp.osmId ? { ...e, instagram: json.instagram, facebook: json.facebook, website: json.website || e.website, telefone: json.telefone || e.telefone } : e) : null);
          }
        } catch (e) {}
      }));
    }
    setChecando(null);
    alert("Varredura de redes concluída com sucesso!");
  }

  async function salvarEmLote\;

c = c.split(targetFunc).join(replFunc);

fs.writeFileSync('app/app/busca/page.tsx', c);
