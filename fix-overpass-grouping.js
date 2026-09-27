const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const regexTags = /const selectors = baseTags\.map\(\(t\) => \{[\s\S]*?return sel \+ andModifiers \+ around \+ ";";\s*\}\);/;

const replacement = `let selectors: string[] = [];
      if (baseTags.length > 20) {
        // MEGA BRAIN GROUPING: Evita erro 406 Not Acceptable por excesso de queries
        const grouped: Record<string, string[]> = {};
        for (const t of baseTags) {
           if (t.includes("=")) {
             const [k, v] = t.split("=");
             if (!grouped[k]) grouped[k] = [];
             grouped[k].push(v);
           } else if (t.includes("~")) {
             const [k, v] = t.split("~");
             if (!grouped[k]) grouped[k] = [];
             const cleanV = v.endsWith(",i") ? v.slice(0, -2) : v;
             grouped[k].push(cleanV);
           }
        }
        for (const k in grouped) {
           const vals = Array.from(new Set(grouped[k])).join("|");
           selectors.push(\`nwr["\${k}"~"\${esc(vals)}"]\${andModifiers}\${around};\`);
        }
      } else {
        selectors = baseTags.map((t) => {
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
      }`;

c = c.replace(regexTags, replacement);
fs.writeFileSync('lib/overpass.ts', c);
