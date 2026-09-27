const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace('setCarregando(true);', "setCarregando(true);\n      const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email').maybeSingle();\n      if (setts?.remetente_email) setSenderEmail(setts.remetente_email);");

fs.writeFileSync('app/app/page.tsx', c);
