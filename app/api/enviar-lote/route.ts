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
    let sb: any = null;
    let user: any = null;

    try {
      const auth = await usuarioObrigatorio();
      sb = auth.sb;
      user = auth.user;
    } catch {
      // Aberto para modo resiliente / local
    }

    const { leadIds, leads: leadsPayload } = await req.json();

    if ((!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) && (!leadsPayload || !Array.isArray(leadsPayload) || leadsPayload.length === 0)) {
      return NextResponse.json({ erro: "Lista de leads ou leadIds é obrigatória para o disparo em lote." }, { status: 400 });
    }

    let settings: any = null;
    if (sb && user) {
      try {
        const { data } = await sb.from("settings").select("*").eq("user_id", user.id).maybeSingle();
        settings = data;
      } catch (e) {
        console.warn("Falha ao ler settings:", e);
      }
    }

    let gmailPassword = settings?.resend_api_key || process.env.GMAIL_APP_PASSWORD || process.env.RESEND_API_KEY;
    if (gmailPassword) gmailPassword = gmailPassword.replace(/\s+/g, "");
    const gmailEmail = settings?.remetente_email || process.env.GMAIL_EMAIL;

    if (!gmailPassword || !gmailEmail) {
      return NextResponse.json(
        { erro: "E-mail ou Senha de App do Gmail não configurados nas Configurações da plataforma nem nas variáveis de ambiente." },
        { status: 400 }
      );
    }

    const negocioNome = settings?.negocio_nome && settings.negocio_nome !== "ProspectAI" ? settings.negocio_nome : "HardZ Sites";
    const negocio = settings || {
      negocio_nome: negocioNome,
      servico: "Criação de websites profissionais de alta conversão",
      diferenciais: "Destaque nas buscas e captação de clientes locais",
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

    // ------------------ MAPA DE LEADS (RESILIENTE) ------------------
    const leadMap = new Map<string, any>();

    // 1. Prioriza leads recebidos diretamente no payload da requisição
    if (Array.isArray(leadsPayload)) {
      leadsPayload.forEach((l: any) => {
        if (l && l.id) leadMap.set(String(l.id), l);
        if (l && l.osm_id) leadMap.set(String(l.osm_id), l);
      });
    }

    // 2. Se temos conexão com Supabase e IDs para buscar, consulta de forma segura
    if (sb && user && Array.isArray(leadIds) && leadIds.length > 0) {
      const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const uuidList = leadIds.filter((id) => typeof id === "string" && isUuid(id));
      const nonUuidList = leadIds.filter((id) => typeof id === "string" && !isUuid(id));

      if (uuidList.length > 0) {
        try {
          const { data: leadsDb } = await sb
            .from("leads")
            .select("id, nome, email, categoria, cidade, pais, website, instagram")
            .in("id", uuidList)
            .eq("user_id", user.id);

          leadsDb?.forEach((l: any) => {
            if (!leadMap.has(String(l.id))) leadMap.set(String(l.id), l);
          });
        } catch (e) {
          console.warn("Consulta Supabase por UUID ignorada:", e);
        }
      }

      if (nonUuidList.length > 0) {
        try {
          const { data: leadsByOsm } = await sb
            .from("leads")
            .select("id, nome, email, categoria, cidade, pais, website, instagram, osm_id")
            .in("osm_id", nonUuidList)
            .eq("user_id", user.id);

          leadsByOsm?.forEach((l: any) => {
            if (l.osm_id && !leadMap.has(String(l.osm_id))) leadMap.set(String(l.osm_id), l);
            if (l.id && !leadMap.has(String(l.id))) leadMap.set(String(l.id), l);
          });
        } catch (e) {
          console.warn("Consulta Supabase por osm_id ignorada:", e);
        }
      }
    }

    // Se nenhum lead com dados foi encontrado
    if (leadMap.size === 0) {
      transporter.close();
      return NextResponse.json({ erro: "Nenhum lead com dados válidos encontrado para o disparo." }, { status: 404 });
    }

    // Busca mensagens pré-geradas se Supabase estiver ativo
    const msgMap = new Map<string, string>();
    if (sb && user && Array.isArray(leadIds) && leadIds.length > 0) {
      try {
        const { data: existingMsgs } = await sb
          .from("messages")
          .select("lead_id, texto")
          .in("lead_id", leadIds)
          .eq("user_id", user.id);

        existingMsgs?.forEach((m: any) => {
          if (m.texto && !msgMap.has(m.lead_id)) msgMap.set(m.lead_id, m.texto);
        });
      } catch (e) {}
    }

    const resultados: any[] = [];
    let sucessos = 0;
    const sentMessages: any[] = [];
    const sentLeadIds: string[] = [];

    // Lista unificada para iteração
    const listaParaEnviar = Array.isArray(leadIds) && leadIds.length > 0
      ? leadIds.map((id) => leadMap.get(String(id))).filter(Boolean)
      : Array.from(leadMap.values());

    // Processamento sequencial rápido
    for (const lead of listaParaEnviar) {
      if (!lead.email || !isEmailValidoParaB2B(lead.email)) {
        resultados.push({ id: lead.id, ok: false, erro: "E-mail inválido ou retido por proteção anti-bounce" });
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
        if (user?.id) {
          sentMessages.push({
            user_id: user.id,
            lead_id: lead.id,
            canal: "email",
            texto: corpo,
            status: "enviada",
          });
        }
        sentLeadIds.push(lead.id);
      } catch (err: any) {
        const erroMsg = err.message || "Erro desconhecido ao enviar e-mail";
        resultados.push({ id: lead.id, ok: false, erro: erroMsg });

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

    // Gravação segura no banco se houver sessão
    if (sentMessages.length > 0 && sb && user) {
      try {
        const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
        const validMessages = sentMessages.filter((m) => isUuid(m.lead_id));
        if (validMessages.length > 0) {
          await sb.from("messages").insert(validMessages);
        }

        const uuidSent = sentLeadIds.filter(isUuid);
        const nonUuidSent = sentLeadIds.filter((id) => !isUuid(id));

        if (uuidSent.length > 0) {
          await sb
            .from("leads")
            .update({ status: "enviado", canal: "email", atualizado_em: new Date().toISOString() })
            .in("id", uuidSent)
            .eq("user_id", user.id);
        }
        if (nonUuidSent.length > 0) {
          await sb
            .from("leads")
            .update({ status: "enviado", canal: "email", atualizado_em: new Date().toISOString() })
            .in("osm_id", nonUuidSent)
            .eq("user_id", user.id);
        }
      } catch (dbErr) {
        console.warn("Aviso ao atualizar banco após envio:", dbErr);
      }
    }

    transporter.close();

    return NextResponse.json({
      ok: true,
      sucessos,
      total: listaParaEnviar.length,
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
