export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { enrichLeadData } from '@/lib/enrichment';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { leadId, nome, cidade, pais, leadData } = await req.json();

    if (!nome || !cidade) {
      return NextResponse.json({ error: 'Faltam parâmetros obrigatórios (nome, cidade)' }, { status: 400 });
    }

    let supabase: any = null;
    let session: any = null;

    try {
      const cookieStore = await cookies();
      supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet: any[]) {
              try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
            },
          },
        }
      );
      const { data } = await supabase.auth.getSession();
      session = data?.session;
    } catch {
      // Aberto para modo local / offline
    }

    // 1. Outscraper Promise (se chave estiver configurada)
    const outscraperPromise = async () => {
      if (process.env.OUTSCRAPER_API_KEY) {
        try {
          const { buscarOutscraper } = await import("@/lib/outscraper");
          const outRes = await buscarOutscraper(`"${nome}" em ${cidade}, ${pais || 'Brasil'}`, process.env.OUTSCRAPER_API_KEY, 1);
          if (outRes && outRes.length > 0) {
            return {
              facebook: outRes[0].facebook || null,
              instagram: outRes[0].instagram || null,
              email: outRes[0].email || null,
              telefone: outRes[0].telefone || null,
              website: outRes[0].website || null,
              fontes: ["outscraper"]
            };
          }
        } catch (e) {
          console.warn("Outscraper fallback aviso:", e);
        }
      }
      return null;
    };

    // 2. OSINT Promise (Deep Web, DuckDuckGo & Redes Sociais)
    const osintPromise = async () => {
      try {
        return await enrichLeadData(nome, cidade, pais || "Brasil");
      } catch (e) {
        return null;
      }
    };

    // Executa ambas as fontes em paralelo para máxima velocidade
    const [outData, osintData] = await Promise.all([outscraperPromise(), osintPromise()]);

    let enriquecido: any = outData || { fontes: [] };

    if (!outData || (!outData.email && !outData.instagram)) {
      if (osintData) {
        enriquecido = {
          facebook: enriquecido?.facebook || osintData.facebook,
          instagram: enriquecido?.instagram || osintData.instagram,
          email: enriquecido?.email || osintData.email,
          telefone: enriquecido?.telefone || osintData.telefone,
          website: enriquecido?.website || osintData.website,
          fontes: [...(enriquecido?.fontes || []), ...(osintData.fontes || [])]
        };
      }
    }

    const updatePayload: any = {
      fontes: enriquecido.fontes || ["osint"],
      enriquecido_em: new Date().toISOString(),
    };

    if (enriquecido.facebook) updatePayload.facebook = enriquecido.facebook;
    if (enriquecido.instagram) updatePayload.instagram = enriquecido.instagram;
    if (enriquecido.email) updatePayload.email = enriquecido.email;
    if (enriquecido.telefone) updatePayload.telefone = enriquecido.telefone;
    if (enriquecido.website) updatePayload.website = enriquecido.website;

    // Atualização segura no Supabase se houver sessão
    if (supabase && session?.user?.id && leadId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);
      try {
        if (isUuid) {
          await supabase.from('leads').update(updatePayload).eq('id', leadId).eq('user_id', session.user.id);
        } else {
          await supabase.from('leads').update(updatePayload).eq('osm_id', leadId).eq('user_id', session.user.id);
        }
      } catch (e) {
        console.warn("Supabase update avisou:", e);
      }
    }

    // Retorna os dados consolidados para o cliente atualizar localStorage e a UI instantaneamente
    return NextResponse.json({
      success: true,
      lead: {
        id: leadId,
        ...(leadData || {}),
        ...updatePayload,
        email: updatePayload.email || leadData?.email || null,
        instagram: updatePayload.instagram || leadData?.instagram || null,
        telefone: updatePayload.telefone || leadData?.telefone || null,
        website: updatePayload.website || leadData?.website || null,
      }
    });
  } catch (error: any) {
    console.error('Erro na API de enriquecimento:', error);
    return NextResponse.json({ error: error.message || "Falha no processo de enriquecimento." }, { status: 500 });
  }
}
