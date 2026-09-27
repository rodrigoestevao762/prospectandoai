const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const regex = /const groupedEquals: Record[\s\S]*?selectors\.push\(\`nw\[\"\$\{k\}\"\~\"\(\$\{v\}\)\",i\]\$\{around\};\`\);\s*\}/;

const exactLogic = `const selectors = tags.map((t) => {
      if (t.includes("~")) {
        const [k, v] = t.split("~");
        return \`nw["\${k}"~"\${esc(v)}",i]\${around};\`;
      }
      const [k, v] = t.split("=");
      return \`nw["\${k}"="\${esc(v)}"]\${around};\`;
    });`;

c = c.replace(regex, exactLogic);

fs.writeFileSync('lib/overpass.ts', c);
