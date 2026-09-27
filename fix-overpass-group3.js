const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const regex = /const groupedKeys: Record<string, Set<string>> = \{\};[\s\S]*?return \`nw\[\"\$\{k\}\"\~\"\^\(\$\{v\}\)\$\",i\]\$\{around\};\`;\s*\}\);/;

const groupedLogic = `
  const groupedEquals: Record<string, Set<string>> = {};
  const groupedRegex: Record<string, Set<string>> = {};
  
  for (const t of tags) {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      if (!groupedRegex[k]) groupedRegex[k] = new Set();
      groupedRegex[k].add(esc(v));
    } else {
      const [k, v] = t.split("=");
      if (!groupedEquals[k]) groupedEquals[k] = new Set();
      groupedEquals[k].add(esc(v));
    }
  }

  const selectors: string[] = [];
  
  for (const [k, values] of Object.entries(groupedEquals)) {
    const v = Array.from(values).join("|");
    selectors.push(\`nw["\${k}"~"^(\${v})$",i]\${around};\`);
  }
  
  for (const [k, values] of Object.entries(groupedRegex)) {
    const v = Array.from(values).join("|");
    selectors.push(\`nw["\${k}"~"(\${v})",i]\${around};\`);
  }
`;

c = c.replace(regex, groupedLogic);
fs.writeFileSync('lib/overpass.ts', c);
