import { NextResponse } from "next/server";
import { enrichLeadData } from "@/lib/enrichment";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { nome, cidade, pais } = await req.json();

    if (!nome || !cidade) {
      return NextResponse.json({ error: "Nome e cidade são obrigatórios" }, { status: 400 });
    }

    const promises: Promise<any>[] = [];

    // 1. Outscraper Promise
    const outscraperPromise = async () => {
      if (process.env.OUTSCRAPER_API_KEY) {
        try {
          const { buscarOutscraper } = await import("@/lib/outscraper");
          const outRes = await buscarOutscraper(`"${nome}" ${cidade} ${pais || ""}`, process.env.OUTSCRAPER_API_KEY, 1);
          if (outRes && outRes.length > 0) {
            return {
              facebook: outRes[0].facebook || null,
              instagram: outRes[0].instagram || null,
              email: outRes[0].email || null,
              telefone: outRes[0].telefone || null,
              website: outRes[0].website || null,
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
      try {
        const osint = await enrichLeadData(nome, cidade, pais);
        return osint;
      } catch (e) {
        return null;
      }
    };

    // Executa AMBOS em paralelo para máxima velocidade
    const [outData, osintData] = await Promise.all([outscraperPromise(), osintPromise()]);

    let enriquecido = outData;

    // Mescla os dados se Outscraper não trouxe tudo
    if (!enriquecido || (!enriquecido.email && !enriquecido.instagram)) {
      if (osintData) {
        enriquecido = { foto: (enriquecido as any)?.foto || (osintData as any)?.foto || null, 
          facebook: enriquecido?.facebook || osintData.facebook,
          instagram: enriquecido?.instagram || osintData.instagram,
          email: enriquecido?.email || osintData.email,
          telefone: enriquecido?.telefone || null,
          website: enriquecido?.website || null,
          fontes: [...(enriquecido?.fontes || []), ...(osintData.fontes || [])]
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: enriquecido || {}
    });
  } catch (error: any) {
    console.error("Erro no enrich search:", error);
    return NextResponse.json({ error: error.message || "Erro no servidor" }, { status: 500 });
  }
}
