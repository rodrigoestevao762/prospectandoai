import * as cheerio from 'cheerio';

export async function scrapeFoto(query: string) {
  try {
    const q = encodeURIComponent(query + " fachada externa");
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${q}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Pega a primeira imagem de resultado na DuckDuckGo
    let imgUrl = $('.result__snippet').first().parent().find('img.result__icon__img').attr('src');
    
    if (!imgUrl) {
       imgUrl = $('img.result__icon__img').first().attr('src');
    }

    if (imgUrl) {
      if (imgUrl.startsWith('//')) {
        return 'https:' + imgUrl;
      }
      return imgUrl;
    }
    
    return null;
  } catch(e) {
    return null;
  }
}
