const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

if (!c.includes('const [limite, setLimite]')) {
  c = c.replace('const [categoria, setCategoria] = useState("todos");', 'const [categoria, setCategoria] = useState("todos");\n  const [limite, setLimite] = useState("1000");');
}

c = c.replace('let bodyData: any = { categoria, cidade, pais };', 'let bodyData: any = { categoria, cidade, pais, limit: parseInt(limite) || 1000 };');

const targetInput = '              <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Cidade (Foco)</label>';
const replInput = '              <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Cidade (Foco)</label>';
const htmlToInject =             <div className="flex-none w-[100px] relative z-10">
              <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Leds Mx</label>
              <div className="relative">
                <input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} required placeholder="1000"
                  className={\w-full bg-[#030609] border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none font-mono \\} />
              </div>
            </div>;

if (!c.includes('Leds Mx')) {
  c = c.replace('<div className="flex-1 min-w-[200px] relative z-10">\n              <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Cidade (Foco)</label>',
  htmlToInject + '\n            <div className="flex-1 min-w-[200px] relative z-10">\n              <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Cidade (Foco)</label>');
}

fs.writeFileSync('app/app/busca/page.tsx', c);
