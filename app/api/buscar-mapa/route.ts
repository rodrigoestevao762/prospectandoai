export const maxDuration = 60;

import { NextResponse } from "next/server";
import { usuarioObrigatorio } from "@/lib/supabase-server";
import { geocodificar, buscarEmpresas } from "@/lib/overpass";
import { CATEGORIAS, getCategoria } from "@/lib/categorias";
import { qualificar } from "@/lib/qualificacao";

const UA = { "User-Agent": "Overpass Turbo/1.0 (https://overpass-turbo.eu)" };

// Busca de empresas no mapa: por cidade (texto) ou por clique (lat/lng), com suporte a raio de até 100km.
export async function POST(req: Request) {
  try {
    try {
      await usuarioObrigatorio();
    } catch {
      // Aberto para demonstração e varredura imediata
    }

    const { lat, lng, cidade, categoriaId, limit, raioKm } = await req.json();
    const effectiveRadiusM = (raioKm ? Number(raioKm) : 15) * 1000;

    let ponto: { lat: number; lng: number; radiusM: number; paisNome: string; bbox?: number[] } | null = null;
    let cidadeNome = cidade || "";
    let paisNome = "";

    if (cidade && (lat == null || lng == null)) {
      const geo = await geocodificar(cidade);
      if (geo) {
        ponto = { ...geo, radiusM: effectiveRadiusM, bbox: geo.bbox || undefined };
      } else {
        ponto = null;
      }

      if (!ponto) return NextResponse.json({ erro: "Cidade não localizada no mapa." }, { status: 404 });
      paisNome = ponto.paisNome;
    } else if (lat != null && lng != null) {
      // Clique no mapa: descobre a cidade via geocodificação reversa
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14&addressdetails=1`,
          { headers: UA }
        );
        if (res.ok) {
          const a = (await res.json())?.address || {};
          cidadeNome = a.city || a.town || a.village || a.municipality || a.suburb || a.county || "Região";
          paisNome = a.country || "";
        } else {
          cidadeNome = "Região";
        }
      } catch {
        cidadeNome = "Região";
      }

      const dLat = effectiveRadiusM / 111000;
      const dLng = effectiveRadiusM / (111000 * Math.cos(lat * Math.PI / 180));
      const bb = [lat - dLat, lng - dLng, lat + dLat, lng + dLng];
      ponto = { lat, lng, radiusM: effectiveRadiusM, paisNome, bbox: bb };
    } else {
      return NextResponse.json({ erro: "Informe a cidade ou clique nas coordenadas do mapa." }, { status: 400 });
    }

    const cat = getCategoria(categoriaId);
    const tags = cat
      ? cat.tags
      : Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));

    const emp = await buscarEmpresas(
      cat?.id || "todos",
      tags,
      ponto.lat,
      ponto.lng,
      ponto.radiusM,
      cidadeNome,
      paisNome,
      ponto.bbox || null,
      limit || 500,
      1
    );

    const resultados = emp
      .map((e) => {
        const q = qualificar({
          website: e.website,
          instagram: e.instagram,
          email: e.email,
          telefone: e.telefone,
          endereco: e.endereco
        });
        return {
          ...e,
          lat: e.lat != null ? Number(e.lat) : ponto!.lat,
          lng: e.lng != null ? Number(e.lng) : ponto!.lng,
          score: q.score,
          nivel: q.nivel,
        };
      })
      .sort((a, b) => {
        // Prioriza empresas com déficit digital (sem website) para prospecção máxima
        if (!a.website && b.website) return -1;
        if (a.website && !b.website) return 1;
        return b.score - a.score;
      })
      .slice(0, limit || 500);

    return NextResponse.json({
      lat: ponto.lat,
      lng: ponto.lng,
      cidade: cidadeNome,
      pais: paisNome,
      raioKm: effectiveRadiusM / 1000,
      total: resultados.length,
      resultados,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
