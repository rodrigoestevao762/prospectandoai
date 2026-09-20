export const runtime = 'edge';

import { NextResponse } from "next/server";
import { buscarOutscraper } from "@/lib/outscraper";
import { scrapeFotoGoogle } from "@/lib/foto-scraper";

const TRANSPARENT_PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    
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

    // Fallback: Scrape Google Images se nǜo tiver Outscraper
    const fallbackFoto = await scrapeFotoGoogle(q);
    if (fallbackFoto) {
      return NextResponse.redirect(fallbackFoto);
    }

    return new NextResponse(TRANSPARENT_PIXEL, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" } });
  } catch (e) {
    return new NextResponse(TRANSPARENT_PIXEL, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" } });
  }
}
