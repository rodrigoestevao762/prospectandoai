import fs from 'fs';

for (const file of ['app/app/foods/page.tsx', 'app/app/insta/page.tsx', 'app/app/mapa/page.tsx']) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');

  // Adjust salvarTodos to support filter
  if (content.includes('async function salvarTodos()')) {
    content = content.replace(
      /async function salvarTodos\(\) \{/g,
      `async function salvarTodos(nivel?: "quente" | "morno" | "frio") {`
    );
    
    content = content.replace(
      /const toSave = resultados\.filter\((.*?)\);/g,
      `let toSave = resultados.filter($1);\n      if (nivel) toSave = toSave.filter(r => r.nivel === nivel);`
    );
    content = content.replace(
      /const naoSalvos = resultados\.filter\((.*?)\);/g,
      `let naoSalvos = resultados.filter($1);\n      if (nivel) naoSalvos = naoSalvos.filter(r => r.nivel === nivel);`
    );

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

    if (file.includes('mapa')) {
      // In mapa: find exactly `<button onClick={salvarTodos}`
      // We can just find the `<button` tag that contains `onClick={salvarTodos}`
      content = content.replace(/<button[^>]*onClick=\{salvarTodos\}[^>]*>[\s\S]*?<\/button>/, newBtns);
    } else {
      // In foods and insta: `<motion.button` with `onClick={salvarTodos}`
      content = content.replace(/<motion\.button[^>]*onClick=\{salvarTodos\}[^>]*>[\s\S]*?<\/motion\.button>/, newBtns);
    }
  }
  
  fs.writeFileSync(file, content);
}
