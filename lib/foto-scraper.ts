import * as cheerio from 'cheerio';

export async function scrapeFotoGoogle(query: string): Promise<string | null> {
  try {
    const url = `https://www.google.com/search?q=\${encodeURIComponent(query + ' fachada')}&tbm=isch`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // As imagens de cache do Google Images normalmente vêm em tags img
    let fotoUrl: string | null = null;
    
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http') && !src.includes('branding/googlelogo')) {
        if (!fotoUrl) fotoUrl = src;
      }
    });

    return fotoUrl;
  } catch (e) {
    return null;
  }
}
