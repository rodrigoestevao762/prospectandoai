import fs from 'fs';

for (const file of ['app/api/buscar-insta/route.ts', 'app/api/buscar-foods/route.ts']) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('runtime =')) {
    fs.writeFileSync(file, "export const runtime = 'edge';\n\n" + content);
  }
}
