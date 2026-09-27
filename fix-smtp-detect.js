const fs = require('fs');
let c = fs.readFileSync('app/api/enviar-lote/route.ts', 'utf8');

const regexTransporter = /const transporter = nodemailer\.createTransport\(\{\s+service: "gmail",\s+auth: \{\s+user: gmailEmail,\s+pass: gmailPassword,\s+\},\s+pool: true,\s+maxConnections: 1,\s+maxMessages: 100,\s+\}\);/;

const replacement = `// ------------------ MEGA BRAIN SMTP AUTO-DETECT ------------------
    // Detecta automaticamente o provedor baseado no formato da chave
    let transportConfig: any = {
      service: "gmail",
      auth: { user: gmailEmail, pass: gmailPassword },
      pool: true, maxConnections: 1, maxMessages: 100,
    };

    if (gmailPassword.startsWith("re_")) {
      // Resend API Key
      transportConfig = {
        host: "smtp.resend.com", port: 465, secure: true,
        auth: { user: "resend", pass: gmailPassword },
        pool: true, maxConnections: 5, maxMessages: 500,
      };
    } else if (gmailPassword.startsWith("SG.")) {
      // SendGrid API Key
      transportConfig = {
        host: "smtp.sendgrid.net", port: 465, secure: true,
        auth: { user: "apikey", pass: gmailPassword },
        pool: true, maxConnections: 5, maxMessages: 500,
      };
    } else if (gmailPassword.startsWith("xkeysib-")) {
      // Brevo (Sendinblue)
      transportConfig = {
        host: "smtp-relay.brevo.com", port: 587, secure: false,
        auth: { user: gmailEmail, pass: gmailPassword },
        pool: true, maxConnections: 5, maxMessages: 500,
      };
    }
    
    const transporter = nodemailer.createTransport(transportConfig);`;

c = c.replace(regexTransporter, replacement);
fs.writeFileSync('app/api/enviar-lote/route.ts', c);
