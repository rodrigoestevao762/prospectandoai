export const maxDuration = 60;

import { NextResponse } from "next/server";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { isEmailValidoParaB2B } from "@/lib/validar-email";
import nodemailer from "nodemailer";

function gerarEmailRapido(lead: any, negocio: any, negocioNome: string) {
  const nomeEmpresa = lead.nome && lead.nome !== "Empresa Desconhecida" ? lead.nome : "sua empresa";
  const local = lead.cidade || lead.pais || "sua região";
  const servico = negocio?.servico || "criação e modernização de websites e presença digital";
  const diferenciais = negocio?.diferenciais || "posicionamento no Google e captação de clientes";

  const assunto = `Parceria estratégica com ${nomeEmpresa} — ${negocioNome}`;
  const corpo = `Olá, equipe da ${nomeEmpresa}!

Meu nome é da equipe de novos negócios da ${negocioNome}.

Estive analisando o mercado em ${local} e identifiquei uma excelente oportunidade para ampliar a presença digital e atração de novos clientes para a ${nomeEmpresa}.

Nós somos especialistas em ${servico}, com foco em ${diferenciais}.

Gostaria de saber se faz sentido conversarmos rapidamente (5 minutos) esta semana para eu apresentar um diagnóstico prático, sem compromisso.

Qual o melhor horário para você?

Atenciosamente,
${negocioNome}
Equipe Comercial`;

  return { assunto, corpo };
}

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
      return NextResponse.json(
        { erro: "E-mail ou Senha de App do Gmail não configurados nas Configurações da plataforma." },
        { status: 400 }
      );
    }

    const negocioNome = settings?.negocio_nome && settings.negocio_nome !== "ProspectAI" ? settings.negocio_nome : "ProspectAI";
    const negocio = settings || {
      negocio_nome: negocioNome,
      servico: "Criação de websites profissionais",
      diferenciais: "Destaque nas buscas e captação de clientes",
    };

    // ------------------ SMTP POOL INTELIGENTE ------------------
    let transportConfig: any = {
      service: "gmail",
      auth: { user: gmailEmail, pass: gmailPassword },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    };

    if (gmailPassword.startsWith("re_")) {
      transportConfig = {
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: { user: "resend", pass: gmailPassword },
        pool: true,
        maxConnections: 10,
        maxMessages: 500,
      };
    } else if (gmailPassword.startsWith("SG.")) {
      transportConfig = {
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        auth: { user: "apikey", pass: gmailPassword },
        pool: true,
        maxConnections: 10,
        maxMessages: 500,
      };
    } else if (gmailPassword.startsWith("xkeysib-")) {
      transportConfig = {
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: { user: gmailEmail, pass: gmailPassword },
        pool: true,
        maxConnections: 10,
        maxMessages: 500,
      };
    }

    const transporter = nodemailer.createTransport(transportConfig);

    // ------------------ BUSCA EM LOTE (1 ÚNICA QUERY) ------------------
    const { data: leads, error: leadsErr } = await sb
      .from("leads")
      .select("id, nome, email, categoria, cidade, pais, website, instagram")
      .in("id", leadIds)
      .eq("user_id", user.id);

    if (leadsErr || !leads) {
      transporter.close();
      return NextResponse.json({ erro: "Erro ao consultar leads no banco de dados." }, { status: 500 });
    }

    const leadMap = new Map<string, any>();
    leads.forEach((l) => leadMap.set(l.id, l));

    // Busca mensagens pré-geradas em 1 única query
    const { data: existingMsgs } = await sb
      .from("messages")
      .select("lead_id, texto")
      .in("lead_id", leadIds)
      .eq("user_id", user.id);

    const msgMap = new Map<string, string>();
    existingMsgs?.forEach((m: any) => {
      if (m.texto && !msgMap.has(m.lead_id)) msgMap.set(m.lead_id, m.texto);
    });

    const resultados: any[] = [];
    let sucessos = 0;
    const sentMessages: any[] = [];
    const sentLeadIds: string[] = [];

    // Processamento sequencial rápido (respeita o rate limit do Gmail sem travamentos)
    for (const leadId of leadIds) {
      const lead = leadMap.get(leadId);

      if (!lead) {
        resultados.push({ id: leadId, ok: false, erro: "Lead não encontrado" });
        continue;
      }

      if (!lead.email || !isEmailValidoParaB2B(lead.email)) {
        resultados.push({ id: leadId, ok: false, erro: "E-mail inválido ou retido por proteção anti-bounce" });
        continue;
      }

      let texto = msgMap.get(lead.id) || "";
      let assunto = "";
      let corpo = "";

      if (texto) {
        assunto = texto.split("\n")[0].replace(/^assunto:\s*/i, "").trim() || `${negocioNome} — contato profissional para ${lead.nome}`;
        corpo = texto.replace(/^Assunto:.*$/im, "").trim();
      } else {
        const gerado = gerarEmailRapido(lead, negocio, negocioNome);
        assunto = gerado.assunto;
        corpo = gerado.corpo;
      }

      try {
        await transporter.sendMail({
          from: `"${negocioNome}" <${gmailEmail}>`,
          to: lead.email,
          subject: assunto,
          text: corpo,
        });

        sucessos++;
        resultados.push({ id: lead.id, ok: true });
        sentMessages.push({
          user_id: user.id,
          lead_id: lead.id,
          canal: "email",
          texto: corpo,
          status: "enviada",
        });
        sentLeadIds.push(lead.id);
      } catch (err: any) {
        const erroMsg = err.message || "Erro desconhecido ao enviar e-mail";
        resultados.push({ id: lead.id, ok: false, erro: erroMsg });

        // Se for erro crítico de autenticação ou limite total do Gmail, interrompe o lote
        if (
          erroMsg.includes("Too many login attempts") ||
          erroMsg.includes("Invalid login") ||
          erroMsg.includes("535") ||
          erroMsg.includes("BadCredentials") ||
          erroMsg.includes("Username and Password not accepted")
        ) {
          transporter.close();
          return NextResponse.json({
            erro: "Falha de autenticação no Gmail. Sua Senha de App foi recusada pelo Google. Atualize em Configurações.",
            sucessos,
            resultados,
          }, { status: 401 });
        }
      }
    }

    // Gravação em lote no banco
    if (sentMessages.length > 0) {
      try {
        await sb.from("messages").insert(sentMessages);
        await sb
          .from("leads")
          .update({ status: "enviado", canal: "email", atualizado_em: new Date().toISOString() })
          .in("id", sentLeadIds);
      } catch (dbErr) {
        console.error("Erro ao atualizar banco após envio:", dbErr);
      }
    }

    transporter.close();

    return NextResponse.json({
      ok: true,
      sucessos,
      total: leadIds.length,
      resultados,
    });
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "não autenticado") return NextResponse.json({ erro: msg }, { status: 401 });
    return NextResponse.json(
      { erro: msg || "Falha crítica no servidor SMTP" },
      { status: 500 }
    );
  }
}
