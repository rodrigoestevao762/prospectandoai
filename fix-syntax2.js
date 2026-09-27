const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

c = c.replace(/nivel: "quente" as const\s*\n\s*}\)\);\s*\n\s*}\)\(\);/g, `nivel: "quente" as const
      }));
      } catch (err) {
        console.error("OSINT Foods falhou:", err);
        return [];
      }
    })();`);

fs.writeFileSync('lib/enrichment.ts', c);
