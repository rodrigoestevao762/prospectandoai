const fs = require('fs');
let c = fs.readFileSync('app/app/mapa/page.tsx', 'utf8');

c = c.replace('const [cidade, setCidade] = useState("");', 'const [cidade, setCidade] = useState("");\n  const [limite, setLimite] = useState("300");');

c = c.replace('async function buscar(p: { cidade?: string; lat?: number; lng?: number }) {', 'async function buscar(p: { cidade?: string; lat?: number; lng?: number; limit?: number }) {');

c = c.replace('body: JSON.stringify({ ...p, categoriaId: catRef.current }),', 'body: JSON.stringify({ ...p, categoriaId: catRef.current, limit: p.limit || parseInt(limite) || 300 }),');

const uiSearchForm = `<form onSubmit={(e) => { e.preventDefault(); if (cidade.trim()) buscar({ cidade: cidade.trim() }); }}`;

const uiReplace = `<form onSubmit={(e) => { e.preventDefault(); if (cidade.trim()) buscar({ cidade: cidade.trim() }); }}`;

const oldForm = `      <form onSubmit={(e) => { e.preventDefault(); if (cidade.trim()) buscar({ cidade: cidade.trim() }); }}
        className="panel mb-4 flex flex-wrap gap-2 rounded-2xl p-3 items-center">
        <select value={cat} onChange={(e) => setCat(e.target.value)}
          className="field-premium mono rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white min-w-[200px]">
          <option value="todos">Todos os Comércios</option>
          {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade (ex: Porto, Açailândia...)"
          className="field-premium mono min-w-44 flex-1 rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white" />
        <button type="submit" disabled={carregando || !pronto}
          className="btn-3d btn-3d-primary py-2 px-6 text-[11px]">
          {carregando ? "varrendo..." : "📡 varrer cidade"}
        </button>
      </form>`;

const newForm = `      <form onSubmit={(e) => { e.preventDefault(); if (cidade.trim()) buscar({ cidade: cidade.trim() }); }}
        className="panel mb-4 flex flex-wrap gap-2 rounded-2xl p-3 items-center">
        <select value={cat} onChange={(e) => setCat(e.target.value)}
          className="field-premium mono rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white min-w-[200px]">
          <option value="todos">Todos os Comércios</option>
          {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <div className="flex gap-2 min-w-44 flex-1">
          <input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} required placeholder="300"
            className="field-premium mono w-20 rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white text-center" title="Máx Leads" />
          <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade (ex: Porto...)"
            className="field-premium mono flex-1 rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white" />
        </div>
        <button type="submit" disabled={carregando || !pronto}
          className="btn-3d btn-3d-primary py-2 px-6 text-[11px]">
          {carregando ? "varrendo..." : "📡 varrer cidade"}
        </button>
      </form>`;

c = c.replace(/<form onSubmit=\(.*\) \{ e\.preventDefault\(\); if \(cidade\.trim\(\)\) buscar\(\{ cidade: cidade\.trim\(\) \}\); \}\} \s*className="panel mb-4 flex flex-wrap gap-2 rounded-2xl p-3 items-center">[\s\S]*?<\/form>/, newForm);

fs.writeFileSync('app/app/mapa/page.tsx', c);
