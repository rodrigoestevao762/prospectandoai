const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const fetchSender = `const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email, resend_api_key').single();
      const currentSender = setts?.remetente_email || 'default';
      const isPro = setts?.resend_api_key && (setts.resend_api_key.startsWith('re_') || setts.resend_api_key.startsWith('SG.') || setts.resend_api_key.startsWith('xkeysib-'));
      const limit = isPro ? 100000 : 450;
      
      const hoje = new Date().toLocaleDateString('pt-BR');
      const storageKey = 'emails_sent_' + hoje + '_' + currentSender;
      let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);
      
      if (enviadosHoje >= limit) {
        return setAviso(\`Limite atingido por hoje (\${limit}). Troque a conta de e-mail nas configurações para enviar mais.\`);
      }`;

const regexDisparo = /const hoje = new Date\(\)\.toLocaleDateString\('pt-BR'\);\s+const storageKey = 'emails_sent_' \+ hoje \+ '_' \+ senderEmail;\s+let enviadosHoje = parseInt\(localStorage\.getItem\(storageKey\) \|\| '0', 10\);\s+if \(enviadosHoje >= 450\) \{\s+return setAviso\('Limite diário de 450 envios atingido por hoje. Não enviaremos mais e-mails para proteger sua conta contra spam.'\);\s+\}/g;

c = c.replace(regexDisparo, fetchSender);

// In the prompt, the user also said "Deseja disparar e-mails para mais X leads (Limite: 450/dia)"
c = c.replace(/Limite: 450\/dia/g, "limite diário");
c = c.replace(/const qtdPermitida = 450 - enviadosHoje;/g, "const qtdPermitida = limit - enviadosHoje;");

fs.writeFileSync('app/app/page.tsx', c);
