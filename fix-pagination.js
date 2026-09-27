const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regex = /const \{ data \} = await supabaseBrowser\(\)[\s\S]*?\.order\("nome"\);\s*setLeads\(\(data \|\| \[\]\) as Lead\[\]\);/;

const replacement = "      let allLeads = [];\n" +
"      let page = 0;\n" +
"      const limit = 1000;\n" +
"      while (true) {\n" +
"        const { data } = await supabaseBrowser()\n" +
"          .from('leads').select('*')\n" +
"          .order('score', { ascending: false }).order('nome')\n" +
"          .range(page * limit, (page + 1) * limit - 1);\n" +
"        \n" +
"        if (data && data.length > 0) {\n" +
"          allLeads = allLeads.concat(data);\n" +
"          if (data.length < limit) break;\n" +
"          page++;\n" +
"        } else {\n" +
"          break;\n" +
"        }\n" +
"      }\n" +
"      setLeads(allLeads);";

c = c.replace(regex, replacement);
fs.writeFileSync('app/app/page.tsx', c);
