export const maxDuration = 60;

import { NextResponse } from "next/server";
import { geocodificar, buscarEmpresas } from "@/lib/overpass";
import { getCategoria, CATEGORIAS } from "@/lib/categorias";
import { qualificar } from "@/lib/qualificacao";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { buscarOutscraper } from "@/lib/outscraper";

export async function POST(req: Request) {
  try {
    await usuarioObrigatorio();
    const { categoria, cidade, pais, motor = "overpass" } = await req.json();
    const cat = getCategoria(categoria);
    if (!cidade || (categoria !== "todos" && !cat)) {
      return NextResponse.json({ erro: "categoria e cidade obrigatórias" }, { status: 400 });
    }
    const geo = await geocodificar(cidade, pais || undefined);
    if (!geo) {
      return NextResponse.json({ erro: "cidade não encontrada" }, { status: 404 });
    }

    let empresas = [];

    if (motor === "google") {
      const searchQuery = `"${cat ? cat.label : 'empresas'}" em ${cidade}, ${geo.paisNome}`;
      const results = await buscarOutscraper(searchQuery, process.env.OUTSCRAPER_API_KEY || "");
      empresas = results.map((e: any) => {
        const q = qualificar({ website: e.website, instagram: e.instagram, email: e.email, telefone: e.telefone, endereco: e.endereco });
        return { ...e, score: q.score, nivel: q.nivel };
      });
    } else {
      const tags = cat
        ? cat.tags
        : Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
      empresas = (await buscarEmpresas(
        cat?.id || "todos", tags, geo.lat, geo.lng, geo.radiusM, cidade, geo.paisNome
      )).map((e) => {
        const q = qualificar({ website: e.website, instagram: e.instagram, email: e.email, telefone: e.telefone, endereco: e.endereco });
        return { ...e, score: q.score, nivel: q.nivel };
      });
    }

    empresas.sort((a: any, b: any) => b.score - a.score || a.nome.localeCompare(b.nome));
    return NextResponse.json({ empresas, total: empresas.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "não autenticado") return NextResponse.json({ erro: msg }, { status: 401 });
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
