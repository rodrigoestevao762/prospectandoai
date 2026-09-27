const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace(/if \(tags\.length > 5\) \{/g, `
      // Se tiver mais de 2 tags OU se a área for gigante (país/estado), aplicamos o Mega Brain Clamping
      if (tags.length > 2 || (n - s) > 0.5 || (e - w) > 0.5) {
`);

// Let's also increase the base clamp from 0.02 (2km) to 0.04 (4km) to give rare niches a chance
c = c.replace(/let maxDelta = 0\.02; \/\/ ~2km \(bom para 300 leads\)/g, `let maxDelta = 0.04; // ~4km (bom para 300 leads)`);
c = c.replace(/if \(requestedLimit > 500\) maxDelta = 0\.04;/g, `if (requestedLimit > 500) maxDelta = 0.08;`);
c = c.replace(/if \(requestedLimit > 1500\) maxDelta = 0\.08;/g, `if (requestedLimit > 1500) maxDelta = 0.15;`);
c = c.replace(/if \(requestedLimit > 4000\) maxDelta = 0\.15;/g, `if (requestedLimit > 4000) maxDelta = 0.25;`);
c = c.replace(/if \(requestedLimit > 8000\) maxDelta = 0\.25;/g, `if (requestedLimit > 8000) maxDelta = 0.40;`);

fs.writeFileSync('lib/overpass.ts', c);
