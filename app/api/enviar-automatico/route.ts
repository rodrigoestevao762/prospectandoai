import { isEmailValidoParaB2B } from "@/lib/validar-email";
import { NextResponse } from "next/server";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { gerarMensagem } from "@/lib/mensagens";
import { enviarEmailDoLead } from "@/lib/email";

export const maxDuration = 25;

// Envio em um clique: resolve o lead instantaneamente, gera mensagem se necessário e envia
export async function POST(req: Request) {
  try {
    let sb: any = null;
    let user: any = null;

    // Resolução ultrarrápida de sessão (máximo 700ms para nunca travar)
    try {
      const authPromise = usuarioObrigatorio();
      const timeoutPromise = new Promise<null>((r) => setTimeout(() => r(null), 700));
      const auth = await Promise.race([authPromise, timeoutPromise]);
      if (auth && typeof auth === "object" && "sb" in auth) {
        sb = (auth as any).sb;
        user = (auth as any).user;
      }
    } catch {
      // Aberto para modo resiliente / local
    }

    const body = await req.json().catch(() => ({}));
    const { leadId, leadData } = body;
    if (!leadId && !leadData) return NextResponse.json({ erro: "leadId ou leadData obrigatório" }, { status: 400 });

    let lead = leadData || null;

    // Se temos leadId mas não leadData, busca de forma rápida no banco
    if (!lead && sb && user && leadId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);
      try {
        const query = isUuid
          ? sb.from("leads").select("*").eq("id", leadId).eq("user_id", user.id).maybeSingle()
          : sb.from("leads").select("*").eq("osm_id", leadId).eq("user_id", user.id).maybeSingle();
        
        const timeoutDb = new Promise<null>((r) => setTimeout(() => r(null), 800));
        const res: any = await Promise.race([query, timeoutDb]);
        if (res && res.data) lead = res.data;
      } catch (e) {
        console.warn("Consulta Supabase por lead falhou:", e);
      }
    }

    if (!lead) return NextResponse.json({ erro: "Lead não encontrado" }, { status: 404 });
    if (!lead.email) return NextResponse.json({ erro: "Lead sem e-mail" }, { status: 400 });

    if (!isEmailValidoParaB2B(lead.email)) {
      return NextResponse.json({ erro: "E-mail bloqueado por ser reconhecido como falso (Anti-Bounce)" }, { status: 400 });
    }

    let settings: any = null;
    if (sb && user) {
      try {
        const query = sb.from("settings").select("negocio_nome, servico, diferenciais, remetente_email, resend_api_key").eq("user_id", user.id).maybeSingle();
        const timeoutDb = new Promise<null>((r) => setTimeout(() => r(null), 600));
        const res: any = await Promise.race([query, timeoutDb]);
        if (res && res.data) settings = res.data;
      } catch (e) {}
    }

    const negocioNome = settings?.negocio_nome && settings.negocio_nome !== "ProspectAI" ? settings.negocio_nome : "HardZ Sites";
    const negocio = settings || {
      negocio_nome: negocioNome,
      servico: "Criação de websites profissionais de alta conversão",
      diferenciais: "Site próprio que aparece no Google, entrega rápida e design moderno",
    };

    // Gera a mensagem instantaneamente se não houver texto
    const g = await gerarMensagem(
      {
        nome: lead.nome || "Empresa",
        categoria: lead.categoria || "Comércio Local",
        cidade: lead.cidade || "sua região",
        pais: lead.pais || "Brasil",
        temSite: Boolean(lead.website),
        temInstagram: Boolean(lead.instagram),
        temEmail: Boolean(lead.email),
        negocio,
        canal: "email",
      },
      process.env.GEMINI_API_KEY || null
    );

    let texto = g.texto;
    let fonte = g.fonte;
    let assunto = "";

    if (texto.includes("Assunto:")) {
      const partes = texto.split("\n\n");
      assunto = partes[0].replace(/^assunto:\s*/i, "").trim();
      texto = partes.slice(1).join("\n\n").trim();
    }

    // Dispara envio de e-mail via SMTP com credenciais configuradas
    const r = await enviarEmailDoLead(sb, user, lead, texto, assunto || undefined, negocioNome);
    if (!r.ok) return NextResponse.json({ erro: r.erro }, { status: r.status });

    // Registra envio no banco em background sem travar o client
    if (sb && user && lead.id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);
      if (isUuid) {
        sb.from("messages").insert({ user_id: user.id, lead_id: lead.id, canal: "email", texto, status: "enviada" }).catch(() => {});
        sb.from("leads").update({ status: "enviado", canal: "email", atualizado_em: new Date().toISOString() }).eq("id", lead.id).eq("user_id", user.id).catch(() => {});
      }
    }

    return NextResponse.json({ ok: true, texto, fonte });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
