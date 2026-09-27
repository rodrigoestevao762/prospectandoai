const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const regex = /const selectors = tags\.map\(\(t\) => \{[\s\S]*?\}\);/;

const groupedLogic = `
  const groupedKeys: Record<string, Set<string>> = {};
  for (const t of tags) {
    let k, v;
    if (t.includes("~")) {
      [k, v] = t.split("~");
    } else {
      [k, v] = t.split("=");
    }
    if (!groupedKeys[k]) groupedKeys[k] = new Set();
    groupedKeys[k].add(esc(v));
  }

  const selectors = Object.entries(groupedKeys).map(([k, values]) => {
    const v = Array.from(values).join("|");
    return \`nw["\${k}"~"^\${v}$",i]\${around};\`;
  });
`;

c = c.replace(regex, groupedLogic);
fs.writeFileSync('lib/overpass.ts', c);
