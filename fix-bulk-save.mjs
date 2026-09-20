import fs from 'fs';

for (const file of ['app/app/foods/page.tsx', 'app/app/insta/page.tsx', 'app/app/mapa/page.tsx']) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');

  // Change salvarTodos to support levels
  if (content.includes('async function salvarTodos()')) {
    content = content.replace(
      /async function salvarTodos\(\) \{/,
      `async function salvarTodos(nivel?: "quente" | "morno" | "frio") {`
    );
    
    // Replace the filter logic in salvarTodos
    const oldFilter = `const toSave = resultados.filter(r => !salvos.has(r.osmId));`;
    const newFilter = `let toSave = resultados.filter(r => !salvos.has(r.osmId));
    if (nivel) toSave = toSave.filter(r => r.nivel === nivel);`;
    content = content.replace(oldFilter, newFilter);

    // Update the buttons UI
    const oldBtn = `<motion.button
                onClick={salvarTodos}`;
    const newBtns = `<div className="flex flex-wrap gap-2 items-center">
                <button onClick={() => salvarTodos()} disabled={carregando || resultados.every(e => salvos.has(e.osmId))} className="btn-3d btn-3d-ghost text-[10px] px-2 py-1">
                  + Salvar Todos
                </button>
                <button onClick={() => salvarTodos("quente")} disabled={carregando || resultados.filter(e => e.nivel === "quente").every(e => salvos.has(e.osmId))} className="btn-3d btn-3d-ghost text-[10px] px-2 py-1 text-[var(--signal)]">
                  + Quentes
                </button>
                <button onClick={() => salvarTodos("morno")} disabled={carregando || resultados.filter(e => e.nivel === "morno").every(e => salvos.has(e.osmId))} className="btn-3d btn-3d-ghost text-[10px] px-2 py-1 text-[#facc15]">
                  + Mornos
                </button>
                <button onClick={() => salvarTodos("frio")} disabled={carregando || resultados.filter(e => e.nivel === "frio").every(e => salvos.has(e.osmId))} className="btn-3d btn-3d-ghost text-[10px] px-2 py-1 text-[#3b82f6]">
                  + Frios
                </button>
              </div>`;

    // Replace the old button block. We need to find the specific block.
    // Let's just use a regex to replace the entire 'salvarTodos' button block.
    const btnRegex = /<motion\.button\s+onClick=\{salvarTodos\}[\s\S]*?<\/motion\.button>/;
    content = content.replace(btnRegex, newBtns);
  } else if (content.includes('salvarEmLote') && !content.includes('salvarEmLote("quente")')) {
    // Add logic if it exists but missing buttons
  } else if (file === 'app/app/mapa/page.tsx') {
      // Mapa might have 'resultados' and 'salvarTodos' ? Let's check what Mapa has.
      // We will check Mapa manually next.
  }
  
  fs.writeFileSync(file, content);
}
