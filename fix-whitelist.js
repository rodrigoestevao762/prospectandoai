const fs = require('fs');
let c = fs.readFileSync('lib/supabase-server.ts', 'utf8');

c = c.replace(/if \(!data\?\.user \|\| data\.user\.email !== 'rodrigoestevao762@gmail\.com'\) throw new Error\("n.*?o autenticado"\);/, 
  `if (!data?.user) throw new Error("não autenticado"); // Liberado temporariamente para o amigo acessar`);

fs.writeFileSync('lib/supabase-server.ts', c);
