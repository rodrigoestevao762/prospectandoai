import { NextResponse } from "next/server";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { gerarMensagem } from "@/lib/mensagens";

export const maxDuration = 15;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { leadId, canal, leadData } = body;

    let sb: any = null;
    let user: any = null;
    let lead: any = leadData || null;
    let settings: any = null;

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

    // Se temos leadId mas não leadData completo, tenta buscar de forma não bloqueante
    if (!lead && sb && user && leadId) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);
        const query = isUuid
          ? sb.from("leads").select("*").eq("id", leadId).eq("user_id", user.id).maybeSingle()
          : sb.from("leads").select("*").eq("osm_id", leadId).eq("user_id", user.id).maybeSingle();
        
        const timeoutDb = new Promise<null>((r) => setTimeout(() => r(null), 800));
        const res: any = await Promise.race([query, timeoutDb]);
        if (res && res.data) lead = res.data;
      } catch {
        // Fallback
      }
    }

    // Se ainda não achou o lead completo, cria estrutura segura com os dados disponíveis
    if (!lead) {
      if (leadId) {
        lead = { id: leadId, nome: "Empresa", categoria: "Comércio Local", cidade: "sua região", pais: "Brasil" };
      } else {
        return NextResponse.json({ erro: "Lead não encontrado" }, { status: 404 });
      }
    }

    // Settings com fallback imediato
    if (sb && user) {
      try {
        const query = sb.from("settings").select("negocio_nome, servico, diferenciais").eq("user_id", user.id).maybeSingle();
        const timeoutDb = new Promise<null>((r) => setTimeout(() => r(null), 600));
        const res: any = await Promise.race([query, timeoutDb]);
        if (res && res.data) settings = res.data;
      } catch {}
    }

    const negocio = settings || {
      negocio_nome: "HardZ Sites",
      servico: "Criação de sites profissionais de alta conversão",
      diferenciais: "Site próprio que aparece no topo do Google, entrega rápida e design ultra-moderno",
    };
    if (negocio.negocio_nome === "ProspectAI") negocio.negocio_nome = "HardZ Sites";

    // Geração de mensagem com motor ultra-rápido (Gemini ou Templates nativos)
    const { texto, fonte } = await gerarMensagem(
      {
        nome: lead.nome || "Empresa",
        categoria: lead.categoria || "Comércio Local",
        cidade: lead.cidade || "sua região",
        pais: lead.pais || "Brasil",
        temSite: Boolean(lead.website),
        temInstagram: Boolean(lead.instagram),
        temEmail: Boolean(lead.email),
        negocio,
        canal: canal || "whatsapp",
      },
      process.env.GEMINI_API_KEY || null
    );

    // Salva histórico de mensagens em background (sem segurar a resposta do usuário)
    if (sb && user && lead.id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);
      if (isUuid) {
        sb.from("messages").insert({
          user_id: user.id,
          lead_id: lead.id,
          canal: canal || (lead.email ? "email" : "whatsapp"),
          texto,
          status: "gerada",
        }).catch(() => {});
        if (lead.status === "novo") {
          sb.from("leads").update({
            status: "mensagem_gerada",
            atualizado_em: new Date().toISOString()
          }).eq("id", lead.id).eq("user_id", user.id).catch(() => {});
        }
      }
    }

    return NextResponse.json({ texto, fonte, ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
