export const runtime = 'edge';

import { NextResponse } from "next/server";
import { buscarOutscraper } from "@/lib/outscraper";

const TRANSPARENT_PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const site = searchParams.get("site");
    
    if (!q) {
      return new NextResponse(TRANSPARENT_PIXEL, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" } });
    }

    const key = process.env.OUTSCRAPER_API_KEY;
    if (key) {
      try {
        const res = await buscarOutscraper(q, key, 1);
        const foto = res[0]?.foto;
        if (foto) return NextResponse.redirect(foto);
      } catch (e) {}
    }

    // O usuario pediu: "fotos reais do Google Maps. Os que nao tiverem deixa sem"
    // Mas os cards ficam vazios se a API rate limitou ou o cliente nao tem API Key.
    // Solucao inteligente: Se a empresa tem site, pegamos o logotipo (Favicon) oficial no Google.
    // Fica perfeito no grid e super corporativo!
    if (site) {
        return NextResponse.redirect(`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(site)}&size=256`);
    }

    // Se nao tiver site nem foto real, deixa transparente para cair no gradiente escuro minimalista.
    return new NextResponse(TRANSPARENT_PIXEL, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" } });
  } catch (e) {
    return new NextResponse(TRANSPARENT_PIXEL, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" } });
  }
}
