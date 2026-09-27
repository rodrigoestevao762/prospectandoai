const fs = require('fs');
let c = fs.readFileSync('app/api/buscar-mapa/route.ts', 'utf8');

c = c.replace('const { lat, lng, cidade, categoriaId } = await req.json();', 'const { lat, lng, cidade, categoriaId, limit } = await req.json();');

c = c.replace('let ponto: { lat: number; lng: number; radiusM: number; paisNome: string } | null = null;', 'let ponto: { lat: number; lng: number; radiusM: number; paisNome: string; bbox?: number[] } | null = null;');

c = c.replace('ponto = { lat, lng, radiusM: 12000, paisNome };', `const dLat = 12000 / 111000;
      const dLng = 12000 / (111000 * Math.cos(lat * Math.PI / 180));
      const bb = [lat - dLat, lng - dLng, lat + dLat, lng + dLng];
      ponto = { lat, lng, radiusM: 12000, paisNome, bbox: bb };`);

c = c.replace(`    emp = await buscarEmpresas(
      cat?.id || "all",
      tags,
      ponto.lat,
      ponto.lng,
      ponto.radiusM,
      cidadeNome,
      paisNome,
      classificar
    );`, `    emp = await buscarEmpresas(
      cat?.id || "all",
      tags,
      ponto.lat,
      ponto.lng,
      ponto.radiusM,
      cidadeNome,
      paisNome,
      classificar,
      limit || 300,
      ponto.bbox
    );`);

c = c.replace('.slice(0, 150);', '.slice(0, limit || 300);');

fs.writeFileSync('app/api/buscar-mapa/route.ts', c);
