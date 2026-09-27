const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const regex = /if \(bbox && bbox\.length === 4\) \{[\s\S]*?bboxString = `\[bbox:\$\{s\},\$\{w\},\$\{n\},\$\{e\}\]`;\s*\}/;

const novoBlock = `if (bbox && bbox.length === 4) {
      let [s, w, n, e] = bbox;
      
      // MEGA BRAIN DYNAMIC CLAMPING v2: 
      // Sempre aplica um limite seguro (maxDelta) independentemente do nmero de tags ou tamanho original,
      // porque mesmo a bbox de uma nica cidade (ex: Porto Alegre) pode causar Timeout 504 no Overpass.
      let maxDelta = 0.2; // ~22kmx22km (cobre o centro expandido de 90% das capitais globais sem timeout)
      if (limit && limit <= 100) maxDelta = 0.1;
      
      const latC = (s + n) / 2;
      const lonC = (w + e) / 2;
      
      if (n - s > maxDelta) { s = latC - maxDelta/2; n = latC + maxDelta/2; }
      if (e - w > maxDelta) { w = lonC - maxDelta/2; e = lonC + maxDelta/2; }

      bboxString = \`[bbox:\${s},\${w},\${n},\${e}]\`;
    }`;

c = c.replace(regex, novoBlock);
fs.writeFileSync('lib/overpass.ts', c);
