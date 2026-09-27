const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/async function disparoEmLote\(\) \{[\s\S]*?const paraEnviar =/, `async function disparoEmLote() {
    const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email, resend_api_key').single();
    const currentSender = setts?.remetente_email || 'default';
    const isPro = setts?.resend_api_key && (setts.resend_api_key.startsWith('re_') || setts.resend_api_key.startsWith('SG.') || setts.resend_api_key.startsWith('xkeysib-'));
    const limit = isPro ? 100000 : 450;
    
    const hoje = new Date().toLocaleDateString('pt-BR');
    const storageKey = 'emails_sent_' + hoje + '_' + currentSender;
    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    if (enviadosHoje >= limit) {
      return setAviso(\`Limite atingido por hoje (\${limit}). Troque a conta de e-mail nas configurações para enviar mais.\`);
    }
    const paraEnviar =`);

// Also fix `enviarAuto`
c = c.replace(/async function enviarAuto\(l: Lead\) \{[\s\S]*?setOcupado\(l\.id \+ ':auto'\);/, `async function enviarAuto(l: Lead) {
    const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email, resend_api_key').single();
    const currentSender = setts?.remetente_email || 'default';
    const isPro = setts?.resend_api_key && (setts.resend_api_key.startsWith('re_') || setts.resend_api_key.startsWith('SG.') || setts.resend_api_key.startsWith('xkeysib-'));
    const limit = isPro ? 100000 : 450;
    
    const hoje = new Date().toLocaleDateString('pt-BR');
    const storageKey = 'emails_sent_' + hoje + '_' + currentSender;
    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    if (enviadosHoje >= limit) {
      return setAviso(\`Limite atingido por hoje (\${limit}). Troque a conta de e-mail nas configurações para enviar mais.\`);
    }
    
    setOcupado(l.id + ':auto');`);

fs.writeFileSync('app/app/page.tsx', c);
