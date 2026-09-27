const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

// Remover o clamp do geocodificar
c = c.replace(/const maxDelta = 0\.03;[\s\S]*?bb = \[s, w, n, e\];/, 'bb = [parseFloat(bbox[0]), parseFloat(bbox[2]), parseFloat(bbox[1]), parseFloat(bbox[3])];');

// Adicionar o clamp dinâmico no buscarEmpresas
const targetBuscar = `  let bboxString = "";
  let around = "";
  if (bbox && bbox.length === 4) {
    bboxString = \`[bbox:\${bbox[0]},\${bbox[1]},\${bbox[2]},\${bbox[3]}]\`;
  } else if (radiusM > 0) {`;

const replaceBuscar = `  let bboxString = "";
  let around = "";
  if (bbox && bbox.length === 4) {
    let [s, w, n, e] = bbox;
    // Se for uma busca muito pesada (ex: Todos os Comércios tem > 40 tags),
    // reduzimos a área de busca drasticamente para não dar 504 Timeout no Overpass
    if (tags.length > 20) {
      const maxDelta = 0.015; // ~1.6km
      const latC = s + (n - s) / 2;
      const lonC = w + (e - w) / 2;
      if (n - s > maxDelta) { s = latC - maxDelta/2; n = latC + maxDelta/2; }
      if (e - w > maxDelta) { w = lonC - maxDelta/2; e = lonC + maxDelta/2; }
    }
    bboxString = \`[bbox:\${s},\${w},\${n},\${e}]\`;
  } else if (radiusM > 0) {`;

c = c.replace(targetBuscar, replaceBuscar);

fs.writeFileSync('lib/overpass.ts', c);
