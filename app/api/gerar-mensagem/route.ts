import { NextResponse } from "next/server";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { gerarMensagem } from "@/lib/mensagens";

export async function POST(req: Request) {
  try {
    const { leadId, canal, leadData } = await req.json();

    let sb: any = null;
    let user: any = null;
    let lead: any = null;
    let settings: any = null;

    try {
      const auth = await usuarioObrigatorio();
      sb = auth.sb;
      user = auth.user;

      if (leadId) {
        const { data } = await sb
          .from("leads").select("*").eq("id", leadId).eq("user_id", user.id).single();
        lead = data;
      }

      const { data: s } = await sb
        .from("settings").select("negocio_nome, servico, diferenciais").eq("user_id", user.id).single();
      settings = s;
    } catch {
      // Aberto para modo local / demonstração
    }

    if (!lead && leadData) {
      lead = leadData;
    }

    if (!lead) return NextResponse.json({ erro: "Lead não encontrado" }, { status: 404 });

    const negocio = settings || {
      negocio_nome: "HardZ Sites",
      servico: "Criação de sites profissionais de alta conversão",
      diferenciais: "Site próprio que aparece no topo do Google, entrega rápida e design ultra-moderno"
    };
    if (negocio.negocio_nome === "ProspectAI") negocio.negocio_nome = "HardZ Sites";

    const { texto, fonte } = await gerarMensagem(
      {
        nome: lead.nome,
        categoria: lead.categoria || "Comércio Local",
        cidade: lead.cidade || "sua região",
        pais: lead.pais || "Brasil",
        temSite: Boolean(lead.website),
        temInstagram: Boolean(lead.instagram),
        temEmail: Boolean(lead.email),
        negocio,
        canal: canal || "instagram",
      },
      process.env.GEMINI_API_KEY || null
    );

    if (sb && user && lead.id) {
      try {
        await sb.from("messages").insert({
          user_id: user.id,
          lead_id: lead.id,
          canal: canal || (lead.email ? "email" : "dm"),
          texto,
          status: "gerada",
        });
        if (lead.status === "novo") {
          await sb.from("leads").update({
            status: "mensagem_gerada",
            atualizado_em: new Date().toISOString()
          }).eq("id", lead.id).eq("user_id", user.id);
        }
      } catch (err) {
        // Silencioso em caso de inserção de log opcional
      }
    }

    return NextResponse.json({ texto, fonte });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "não autenticado") return NextResponse.json({ erro: msg }, { status: 401 });
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
