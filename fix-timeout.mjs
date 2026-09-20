import fs from 'fs';

let enrichment = fs.readFileSync('lib/enrichment.ts', 'utf-8');

// We will add safePromise helper at the top, or just inside the functions.
// Let's just replace the Promise.all lines.

const replacementInsta = `  const safePromise = (p: Promise<any>, ms: number) => Promise.race([p, new Promise<any[]>(r => setTimeout(() => r([]), ms))]);
  const [overpassResults, osintResults] = await Promise.all([
    safePromise(overpassPromise, 7500),
    safePromise(osintPromise, 7500)
  ]);`;

enrichment = enrichment.replace(
  'const [overpassResults, osintResults] = await Promise.all([overpassPromise, osintPromise]);',
  replacementInsta
);

// radarFoods has the same line, so replacing globally will replace both!
// But wait, replace globally?
enrichment = enrichment.replaceAll(
  'const [overpassResults, osintResults] = await Promise.all([overpassPromise, osintPromise]);',
  replacementInsta
);

// We need to make sure we didn't add safePromise twice in the same scope, but they are in separate function scopes!
// Actually, safePromise is defined using const, so in each function it will be local.

fs.writeFileSync('lib/enrichment.ts', enrichment);
