const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/const \[aviso, setAviso\] = useState<string \| null>\(null\);/, 
  "const [aviso, setAviso] = useState<string | null>(null);\n    const [senderEmail, setSenderEmail] = useState('');");

c = c.replace(/const carregar = useCallback\(async \(\) => \{\n\s*setCarregando\(true\);/, 
  "const carregar = useCallback(async () => {\n      setCarregando(true);\n      const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email').maybeSingle();\n      if (setts?.remetente_email) setSenderEmail(setts.remetente_email);\n");

c = c.replace(/const storageKey = 'emails_sent_' \+ hoje;/g, 
  "const storageKey = 'emails_sent_' + hoje + '_' + senderEmail;");

fs.writeFileSync('app/app/page.tsx', c);
