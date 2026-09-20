import * as cheerio from 'cheerio';
async function get() {
  try {
    const res = await fetch('https://www.google.com/search?q=pizzaria+marguerita+sao+paulo', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let imageUrl = '';
    // Procurar por imagens no Knowledge Panel
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('googleusercontent.com') && !src.includes('favicons')) {
        imageUrl = src;
        return false; // quebra o loop
      }
    });

    console.log("Image URL:", imageUrl);
  } catch (e) {
    console.error(e);
  }
}
get();
