const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

const target = `nivel: "morno" as const
        };
      });
    })();`;

const replacement = `nivel: "morno" as const
        };
      });
      } catch (err) {
        console.error("OSINT Insta falhou:", err);
        return [];
      }
    })();`;

c = c.replace(/nivel: "morno"( as const)?\s*\n\s*};\s*\n\s*}\);\s*\n\s*}\)\(\);/g, replacement);

fs.writeFileSync('lib/enrichment.ts', c);
