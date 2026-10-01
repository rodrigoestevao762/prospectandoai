import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { load } from "cheerio";

const CACHE_OK = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

function urlPublica(valor: string, base?: string): URL | null {
  try {
    const limpo = valor.trim();
    const valorComProtocolo = base || /^[a-z][a-z\d+.-]*:/i.test(limpo) || limpo.startsWith("//")
      ? limpo
      : `https://${limpo}`;
    const url = new URL(valorComProtocolo, base);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password || isIP(host)) return null;
    if (!host.includes(".") || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return null;
    return url;
  } catch {
    return null;
  }
}

async function htmlLimitado(response: Response, limite = 1_500_000): Promise<string | null> {
  if (!response.body) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limite) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const combinado = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combinado.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(combinado);
}

async function buscarImagemDoSite(site: URL): Promise<string | null> {
  let atual = site;

  for (let tentativa = 0; tentativa < 4; tentativa++) {
    const response = await fetch(atual, {
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (compatible; ProspectandoAI/1.0)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      const destino = location ? urlPublica(location, atual.href) : null;
      if (!destino) return null;
      atual = destino;
      continue;
    }

    if (!response.ok || !/(text\/html|application\/xhtml\+xml)/i.test(response.headers.get("content-type") || "")) return null;

    const html = await htmlLimitado(response);
    if (!html) return null;
    const $ = load(html);
    const candidatos = [
      $('meta[property="og:image:secure_url"]').attr("content"),
      $('meta[property="og:image"]').attr("content"),
      $('meta[name="twitter:image"]').attr("content"),
      $('meta[name="twitter:image:src"]').attr("content"),
      $('meta[itemprop="image"]').attr("content"),
      $('link[rel="image_src"]').attr("href"),
    ];

    for (const candidato of candidatos) {
      if (!candidato?.trim()) continue;
      const imagem = urlPublica(candidato.trim(), atual.href);
      if (imagem) return imagem.href;
    }
    return null;
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const site = urlPublica(searchParams.get("website") || "");
  if (!site) {
    return NextResponse.json({ erro: "site indisponível" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const imagem = await buscarImagemDoSite(site);
    if (!imagem) {
      return NextResponse.json({ erro: "foto não encontrada no site" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.redirect(imagem, { headers: { "Cache-Control": CACHE_OK } });
  } catch {
    return NextResponse.json({ erro: "não foi possível consultar o site" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
}
