import { NextResponse } from "next/server";
import { enrichLeadData } from "@/lib/enrichment";

export async function POST(req: Request) {
  try {
    const { nome, cidade, pais } = await req.json();

    if (!nome || !cidade) {
      return NextResponse.json({ error: "Nome e cidade são obrigatórios" }, { status: 400 });
    }

    let enriquecido: any = null;

    if (process.env.OUTSCRAPER_API_KEY) {
      try {
        const { buscarOutscraper } = await import("@/lib/outscraper");
        const outRes = await buscarOutscraper(`"${nome}" ${cidade} ${pais || ""}`, process.env.OUTSCRAPER_API_KEY, 1);
        if (outRes && outRes.length > 0) {
          enriquecido = {
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

    if (!enriquecido || (!enriquecido.email && !enriquecido.instagram)) {
      const osint = await enrichLeadData(nome, cidade, pais);
      enriquecido = {
        facebook: enriquecido?.facebook || osint.facebook,
        instagram: enriquecido?.instagram || osint.instagram,
        email: enriquecido?.email || osint.email,
        telefone: enriquecido?.telefone || null,
        website: enriquecido?.website || null,
        fontes: [...(enriquecido?.fontes || []), ...osint.fontes]
      };
    }

    return NextResponse.json({
      success: true,
      data: enriquecido
    });
  } catch (error: any) {
    console.error("Erro no enrich search:", error);
    return NextResponse.json({ error: error.message || "Erro no servidor" }, { status: 500 });
  }
}
