const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const regex = /const selectors = tags\.map\(\(t\) => \{[\s\S]*?\}\);/;
const replacement = `
    const baseTags = tags.filter(t => !t.startsWith("AND:"));
    const andTags = tags.filter(t => t.startsWith("AND:")).map(t => t.substring(4));
    
    let andModifiers = "";
    for (const t of andTags) {
      if (t.includes("~")) {
        const [k, v] = t.split("~");
        if (v.endsWith(',i')) {
          andModifiers += \`["\${k}"~"\${esc(v.slice(0, -2))}",i]\`;
        } else {
          andModifiers += \`["\${k}"~"\${esc(v)}"]\`;
        }
      } else if (t.includes("=")) {
        const [k, v] = t.split("=");
        andModifiers += \`["\${k}"="\${esc(v)}"]\`;
      } else {
        andModifiers += \`["\${t}"]\`;
      }
    }

    const selectors = baseTags.map((t) => {
      let sel = "";
      if (t.includes("~")) {
        const [k, v] = t.split("~");
        if (v.endsWith(',i')) {
          sel = \`nwr["\${k}"~"\${esc(v.slice(0, -2))}",i]\`;
        } else {
          sel = \`nwr["\${k}"~"\${esc(v)}"]\`;
        }
      } else if (t.includes("=")) {
        const [k, v] = t.split("=");
        sel = \`nwr["\${k}"="\${esc(v)}"]\`;
      } else {
        sel = \`nwr["\${t}"]\`;
      }
      return sel + andModifiers + around + ";";
    });
`;

c = c.replace(regex, replacement);

fs.writeFileSync('lib/overpass.ts', c);
