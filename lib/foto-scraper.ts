import * as cheerio from 'cheerio';

export async function scrapeFotoBing(query: string): Promise<string | null> {
  try {
    const url = `https://www.bing.com/images/search?q=\${encodeURIComponent(query + ' local store')}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let fotoUrl: string | null = null;
    
    $('img.mimg').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.startsWith('http') && !src.includes('data:image')) {
        fotoUrl = src;
        return false;
      }
    });

    return fotoUrl;
  } catch (e) {
    return null;
  }
}
