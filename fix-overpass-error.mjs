import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');

overpass = overpass.replace(
  'if (ultimoErro) throw ultimoErro;',
  'if (ultimoErro) throw new Error("Os servidores do mapa estão sobrecarregados no momento. Por favor, tente novamente em alguns segundos.");'
);

fs.writeFileSync('lib/overpass.ts', overpass);
