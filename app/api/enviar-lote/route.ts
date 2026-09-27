import { isEmailValidoParaB2B } from "@/lib/validar-email";
﻿export const maxDuration = 60;
import { NextResponse } from "next/server";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { gerarMensagem } from "@/lib/mensagens";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { sb, user } = await usuarioObrigatorio();
    const { leadIds } = await req.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ erro: "Lista de leadIds obrigatória" }, { status: 400 });
    }

    const { data: settings } = await sb.from("settings").select("*").eq("user_id", user.id).single();
    let gmailPassword = settings?.resend_api_key || process.env.GMAIL_APP_PASSWORD;
    if (gmailPassword) gmailPassword = gmailPassword.replace(/\s+/g, "");
    const gmailEmail = settings?.remetente_email || process.env.GMAIL_EMAIL;

    if (!gmailPassword || !gmailEmail) {
      return NextResponse.json({ erro: "E-mail ou Senha de App do Gmail não configurados." }, { status: 400 });
    }

    const negocioNome = settings?.negocio_nome && settings.negocio_nome !== "ProspectAI" ? settings.negocio_nome : "HardZ Sites";
    const negocio = settings || { negocio_nome: "HardZ Sites", servico: "Criação de sites profissionais", diferenciais: "Aparecer no Google" };

    // ------------------ MEGA BRAIN SMTP AUTO-DETECT ------------------
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
    
    const transporter = nodemailer.createTransport(transportConfig);

    const resultados = [];
    let sucessos = 0;

    for (const leadId of leadIds) {
      try {
        const { data: lead } = await sb.from("leads").select("*").eq("id", leadId).eq("user_id", user.id).single();
        if (!lead || !lead.email) continue;
        
        if (!isEmailValidoParaB2B(lead.email)) continue;

        const { data: ultima } = await sb.from("messages").select("texto").eq("lead_id", leadId).order("criado_em", { ascending: false }).limit(1).maybeSingle();
        let texto = ultima?.texto || "";

        if (!texto) {
          const resAI = await gerarMensagem({
            nome: lead.nome, categoria: lead.categoria, cidade: lead.cidade, pais: lead.pais,
            temSite: Boolean(lead.website), temInstagram: Boolean(lead.instagram), temEmail: true, negocio, canal: "email",
          }, process.env.GEMINI_API_KEY || null);
          texto = resAI.texto;
        }

        const assunto = texto.split("\n")[0].replace(/assunto:/i, "").trim() || `${negocioNome} — contato profissional para ${lead.nome}`;
        let corpo = texto.replace(/^Assunto:.*$/im, "").trim();

        await transporter.sendMail({
          from: `"${negocioNome}" <${gmailEmail}>`,
          to: lead.email,
          subject: assunto,
          text: corpo,
        });
        
        await sb.from("messages").insert({ user_id: user.id, lead_id: lead.id, canal: "email", texto: corpo, status: "enviada" });
        await sb.from("leads").update({ status: "enviado", canal: "email", atualizado_em: new Date().toISOString() }).eq("id", lead.id);
        
        sucessos++;
        resultados.push({ id: lead.id, ok: true });
      } catch (err: any) {
        if (err.message && (err.message.includes("Too many login attempts") || err.message.includes("Invalid login") || err.message.includes("535"))) {
          throw err; // Força parada e retorna o erro fatal para a UI
        }
        resultados.push({ id: leadId, ok: false, erro: err.message });
      }
      
      // Delay minúsculo interno apenas para o Google não engasgar o pipe SMTP
      await new Promise(r => setTimeout(r, 200));
    }
    
    transporter.close();

    return NextResponse.json({ ok: true, sucessos, resultados });
  } catch (e: any) {
    return NextResponse.json({ erro: e.message || "Falha crítica no servidor SMTP" }, { status: 500 });
  }
}
