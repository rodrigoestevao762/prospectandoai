import { isEmailValidoParaB2B } from "@/lib/validar-email";
import { NextResponse } from "next/server";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { gerarMensagem } from "@/lib/mensagens";
import { enviarEmailDoLead } from "@/lib/email";

// Envio em um clique: gera a mensagem (se ainda não houver) e envia o e-mail.
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

    const { leadId, leadData } = await req.json();
    if (!leadId && !leadData) return NextResponse.json({ erro: "leadId ou leadData obrigatório" }, { status: 400 });

    let lead = leadData || null;

    if (!lead && sb && user && leadId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);
      try {
        if (isUuid) {
          const { data } = await sb.from("leads").select("*").eq("id", leadId).eq("user_id", user.id).maybeSingle();
          lead = data;
        } else {
          const { data } = await sb.from("leads").select("*").eq("osm_id", leadId).eq("user_id", user.id).maybeSingle();
          lead = data;
        }
      } catch (e) {
        console.warn("Consulta Supabase por lead falhou:", e);
      }
    }

    if (!lead) return NextResponse.json({ erro: "Lead não encontrado" }, { status: 404 });
    if (!lead.email) return NextResponse.json({ erro: "Lead sem e-mail" }, { status: 400 });

    if (!isEmailValidoParaB2B(lead.email)) {
      return NextResponse.json({ erro: "E-mail bloqueado por ser reconhecido como falso (Anti-Bounce)" }, { status: 400 });
    }

    // Reutiliza a última mensagem gerada, se existir; senão gera agora
    let texto = "";
    let fonte = "existente";

    if (sb && user && leadId) {
      try {
        const { data: ultima } = await sb
          .from("messages").select("texto, status")
          .eq("lead_id", leadId).order("criado_em", { ascending: false }).limit(1).maybeSingle();
        if (ultima?.texto) texto = ultima.texto;
      } catch (e) {}
    }

    let settings: any = null;
    if (sb && user) {
      try {
        const { data } = await sb.from("settings").select("negocio_nome, servico, diferenciais").eq("user_id", user.id).maybeSingle();
        settings = data;
      } catch (e) {}
    }

    const negocioNome = settings?.negocio_nome && settings.negocio_nome !== "ProspectAI" ? settings.negocio_nome : "HardZ Sites";
    const negocio = settings || {
      negocio_nome: negocioNome,
      servico: "Criação de websites profissionais de alta conversão",
      diferenciais: "Site próprio que aparece no Google, entrega rápida e design moderno",
    };

    if (!texto) {
      const g = await gerarMensagem(
        {
          nome: lead.nome,
          categoria: lead.categoria || "Comércio Local",
          cidade: lead.cidade || "sua região",
          pais: lead.pais || "Brasil",
          temSite: Boolean(lead.website),
          temInstagram: Boolean(lead.instagram),
          temEmail: Boolean(lead.email),
          negocio,
        },
        process.env.GEMINI_API_KEY || null
      );
      texto = g.texto;
      fonte = g.fonte;

      if (sb && user && lead.id) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);
        if (isUuid) {
          try {
            await sb.from("messages").insert({ user_id: user.id, lead_id: lead.id, canal: "email", texto, status: "gerada" });
          } catch (e) {}
        }
      }
    }

    const r = await enviarEmailDoLead(sb, user, lead, texto, undefined, negocioNome);
    if (!r.ok) return NextResponse.json({ erro: r.erro }, { status: r.status });
    return NextResponse.json({ ok: true, texto, fonte });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "não autenticado") return NextResponse.json({ erro: msg }, { status: 401 });
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
