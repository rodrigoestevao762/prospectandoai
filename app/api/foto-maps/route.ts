import { NextResponse } from "next/server";
import { buscarOutscraper } from "@/lib/outscraper";
import { scrapeFoto } from "@/lib/foto-scraper";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    if (!q) return NextResponse.redirect("https://via.placeholder.com/150?text=Sem+Query");

    const key = process.env.OUTSCRAPER_API_KEY;
    if (key) {
      try {
        const res = await buscarOutscraper(q, key, 1);
        const foto = res[0]?.foto;
        if (foto) return NextResponse.redirect(foto);
      } catch (e) {}
    }

    // Fallback: DDG Scraper
    const fotoScrape = await scrapeFoto(q);
    if (fotoScrape) {
      return NextResponse.redirect(fotoScrape);
    }

    return NextResponse.redirect("https://via.placeholder.com/150?text=Sem+Foto");
  } catch (e) {
    return NextResponse.redirect("https://via.placeholder.com/150?text=Erro");
  }
}
