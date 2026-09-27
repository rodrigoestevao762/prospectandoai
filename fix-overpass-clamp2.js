const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace(/if \(tags\.length > 2 \|\| \(n - s\) > 0\.5 \|\| \(e - w\) > 0\.5\) \{[\s\S]*?\}/, `
      // MEGA BRAIN DYNAMIC CLAMPING: 
      // Sempre aplica maxDelta para evitar Timeouts 504 na API Pblica do Overpass.
      let maxDelta = 0.2; // ~22kmx22km (cobre 90% das capitais sem timeout)
      if (limit && limit <= 100) maxDelta = 0.1;
      
      const latC = (s + n) / 2;
      const lonC = (w + e) / 2;
      if (n - s > maxDelta) { s = latC - maxDelta/2; n = latC + maxDelta/2; }
      if (e - w > maxDelta) { w = lonC - maxDelta/2; e = lonC + maxDelta/2; }
`);

fs.writeFileSync('lib/overpass.ts', c);
