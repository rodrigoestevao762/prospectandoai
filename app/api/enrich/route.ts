export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { enrichLeadData } from '@/lib/enrichment';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { leadId, nome, cidade, pais } = await req.json();

    if (!leadId || !nome || !cidade) {
      return NextResponse.json({ error: 'Faltam parametros (leadId, nome, cidade)' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: any[]) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

    // 1. Outscraper Promise
    const outscraperPromise = async () => {
      if (process.env.OUTSCRAPER_API_KEY) {
        try {
          const { buscarOutscraper } = await import("@/lib/outscraper");
          const outRes = await buscarOutscraper(`"${nome}" em ${cidade}, ${pais}`, process.env.OUTSCRAPER_API_KEY, 1);
          if (outRes && outRes.length > 0) {
            return {
              facebook: outRes[0].facebook || null,
              instagram: outRes[0].instagram || null,
              email: outRes[0].email || null,
              foto: outRes[0].foto || null,
              fontes: ["outscraper"]
            };
          }
        } catch (e) {
          console.error("Outscraper fallback erro:", e);
        }
      }
      return null;
    };

    // 2. OSINT Promise
    const osintPromise = async () => {
      try { return await enrichLeadData(nome, cidade, pais); } catch (e) { return null; }
    };

    // Executa AMBOS em paralelo para velocidade extrema
    const [outData, osintData] = await Promise.all([outscraperPromise(), osintPromise()]);

    let enriquecido = outData || { fontes: [] };

    if (!outData || (!outData.email && !outData.instagram)) {
      if (osintData) {
        enriquecido = {
          facebook: enriquecido?.facebook || osintData.facebook,
          instagram: enriquecido?.instagram || osintData.instagram,
          email: enriquecido?.email || osintData.email,
          fontes: [...(enriquecido?.fontes || []), ...(osintData.fontes || [])]
        };
      }
    }

    const { data: lead } = await supabase
      .from('leads').select('facebook, instagram, email').eq('id', leadId).eq('user_id', session.user.id).single();

    const updatePayload: any = {
      fontes: enriquecido.fontes,
      enriquecido_em: new Date().toISOString(),
    };
    if (enriquecido.foto) updatePayload.fontes.push(`foto|${enriquecido.foto}`);
    if (!lead?.facebook && enriquecido.facebook) updatePayload.facebook = enriquecido.facebook;
    if (!lead?.instagram && enriquecido.instagram) updatePayload.instagram = enriquecido.instagram;
    if (!lead?.email && enriquecido.email) updatePayload.email = enriquecido.email;

    const { data: updatedLead, error } = await supabase
      .from('leads').update(updatePayload).eq('id', leadId).eq('user_id', session.user.id).select().single();

    if (error) return NextResponse.json({ error: 'Erro ao salvar no banco de dados' }, { status: 500 });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: any) {
    console.error('Erro na API de enriquecimento:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
