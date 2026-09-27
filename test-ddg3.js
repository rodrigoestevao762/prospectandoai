async function searchDuckDuckGo(query) {
    try {
      const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        signal: AbortSignal.timeout(10000)
      });
      return await res.text();
    } catch (err) {
      return '';
    }
}
searchDuckDuckGo('"Padaria" "Londres" "instagram.com"').then(html => console.log(html.match(/instagram\.com\/([A-Za-z0-9_.]+)/gi)));
