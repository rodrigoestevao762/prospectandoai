export const runtime = 'edge';

import { NextResponse } from "next/server";
import { buscarOutscraper } from "@/lib/outscraper";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    
    if (!q) {
      return NextResponse.redirect(`https://ui-avatars.com/api/?name=L&background=random&size=200`);
    }

    const key = process.env.OUTSCRAPER_API_KEY;
    if (key) {
      try {
        const res = await buscarOutscraper(q, key, 1);
        const foto = res[0]?.foto;
        if (foto) return NextResponse.redirect(foto);
      } catch (e) {}
    }

    // Fallback: Retorna as iniciais da empresa coloridas
    const cleanName = q.split(' ').slice(0, 2).join(' ').replace(/[^a-zA-Z0-9\s]/g, '');
    return NextResponse.redirect(`https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName || q)}&background=random&color=fff&size=200&bold=true`);
  } catch (e) {
    return NextResponse.redirect(`https://ui-avatars.com/api/?name=ER&background=random&size=200`);
  }
}
