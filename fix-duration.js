const fs = require('fs');

const fixRoute = (path) => {
  let c = fs.readFileSync(path, 'utf8');
  if (!c.includes('maxDuration')) {
    c = c.replace('import { NextResponse }', 'export const maxDuration = 60;\nimport { NextResponse }');
    fs.writeFileSync(path, c);
  }
};

fixRoute('app/api/enrich/route.ts');
fixRoute('app/api/enrich-search/route.ts');
