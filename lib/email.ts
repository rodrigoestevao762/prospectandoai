import { isEmailValidoParaB2B } from "./validar-email";
import nodemailer from "nodemailer";

const LIMITE_POR_DIA = 450;

type LeadEmail = { id: string; nome: string; email: string | null; osm_id?: string };

export async function enviarEmailDoLead(
  sb: any,
  user: { id: string } | null,
  lead: LeadEmail,
  texto: string,
  assunto?: string,
  negocioNome = "HardZ Sites"
): Promise<{ ok: true } | { ok: false; erro: string; status: number }> {
  if (!lead.email) return { ok: false, erro: "lead sem e-mail", status: 400 };

  const l = lead.email.toLowerCase().trim();
  const parts = l.split('@');
  if (parts.length !== 2) return { ok: false, erro: "e-mail em formato inválido", status: 400 };
  const userPart = parts[0];
  const domainPart = parts[1];

  const extensoesInvalidas = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".css", ".js", ".ttf", ".woff"];
  const dominiosBloqueados = [
    "duckduckgo", "sentry", "example", "w3.org", "sijax", "bing.com", "yahoo.com",
    "google.com", "microsoft.com", "facebook.com", "instagram.com", "twitter.com",
    "apple.com", "cloudflare.com", "ifood.com", "tripadvisor.com", "tiktok.com",
    "linkedin.com", "amazon.com", "qwant.com", "email.com", "teste.com", "test.com",
    "site.com", "suaempresa.com", "dominio.com", "domain.com", "yourdomain.com", "wixsite.com"
  ];
  const usernamesBloqueados = [
    "seuemail", "seunome", "email", "teste", "test", "noreply", "no-reply", "naoresponda", 
    "donotreply", "1234", "admin@site", "contato@site", "contato@suaempresa", "nome@site"
  ];

  if (
    extensoesInvalidas.some(ext => l.endsWith(ext)) ||
    dominiosBloqueados.some(d => domainPart.includes(d)) ||
    l.length > 50 || l.length < 5 ||
    l.includes('+or+') || userPart === '22' ||
    l.startsWith('-') || l.startsWith('.') ||
    usernamesBloqueados.some(u => userPart === u || userPart.includes(u)) ||
    !domainPart.includes('.') || domainPart.split('.').some(p => p.length === 0)
  ) {
    return { ok: false, erro: "E-mail bloqueado por conter formato inválido ou ser reconhecido como falso (Anti-Bounce)", status: 400 };
  }

  let settings: any = null;
  if (sb && user?.id) {
    try {
      const { data } = await sb.from("settings").select("*").eq("user_id", user.id).maybeSingle();
      settings = data;
    } catch (e) {}
  }

  let gmailPassword = settings?.resend_api_key || process.env.GMAIL_APP_PASSWORD || process.env.RESEND_API_KEY;
  if (gmailPassword) gmailPassword = gmailPassword.replace(/\s+/g, "");
  const gmailEmail = settings?.remetente_email || process.env.GMAIL_EMAIL;

  if (!gmailPassword || !gmailEmail) {
    return { ok: false, erro: "E-mail ou Senha de App do Gmail não configurados nas configurações nem no servidor.", status: 400 };
  }

  let transportConfig: any = {
    service: "gmail",
    auth: { user: gmailEmail, pass: gmailPassword },
  };

  if (gmailPassword.startsWith("re_")) {
    transportConfig = {
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: { user: "resend", pass: gmailPassword },
    };
  } else if (gmailPassword.startsWith("SG.")) {
    transportConfig = {
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      auth: { user: "apikey", pass: gmailPassword },
    };
  } else if (gmailPassword.startsWith("xkeysib-")) {
    transportConfig = {
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: { user: gmailEmail, pass: gmailPassword },
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);

  try {
    await transporter.sendMail({
      from: `"${negocioNome}" <${gmailEmail}>`,
      to: lead.email,
      subject: assunto || `${negocioNome} — contato profissional para ${lead.nome}`,
      text: texto,
    });
    
    if (sb && user?.id && lead.id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);
      try {
        if (isUuid) {
          await sb.from("messages").insert({ user_id: user.id, lead_id: lead.id, canal: "email", texto, status: "enviada" });
          await sb.from("leads").update({ status: "enviado", canal: "email", atualizado_em: new Date().toISOString() }).eq("id", lead.id);
        } else {
          await sb.from("leads").update({ status: "enviado", canal: "email", atualizado_em: new Date().toISOString() }).eq("osm_id", lead.id);
        }
      } catch (e) {
        console.warn("Aviso ao persistir envio no banco:", e);
      }
    }
    return { ok: true };
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    if (sb && user?.id && lead.id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);
      if (isUuid) {
        try {
          await sb.from("messages").insert({ user_id: user.id, lead_id: lead.id, canal: "email", texto, status: "erro", erro: error.message || "Erro SMTP" });
        } catch (e) {}
      }
    }
    return { ok: false, erro: error.message || "Falha no provedor de e-mail (Gmail)", status: 502 };
  }
}
