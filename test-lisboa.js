const CATEGORIAS = [
  { id: "barbearia", label: "Barbearias", tags: ["shop=hairdresser", "shop~barber"] },
  { id: "construtora", label: "Construtoras e Reformas", tags: ["craft=builder", "craft=plasterer", "craft=roofer", "craft=carpenter", "shop=doityourself", "office=construction_company", "craft=painter"] },
  { id: "restaurante", label: "Restaurantes", tags: ["amenity=restaurant"] }
];

function esc(s) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

async function test() {
  const cidade = "Lisboa";
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade)}&format=json&limit=1`;
  const resGeo = await fetch(url, { headers: { "User-Agent": "ProspectAI" } });
  const data = await resGeo.json();
  const d = data[0];
  const bboxData = String(d.boundingbox || "").split(",");
  let bb;
  let radiusM = 12000;
  if (bboxData.length === 4) {
    bb = [parseFloat(bboxData[0]), parseFloat(bboxData[2]), parseFloat(bboxData[1]), parseFloat(bboxData[3])];
  }
  
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  let bboxString = `[bbox:${bb[0]},${bb[1]},${bb[2]},${bb[3]}]`;
  let around = "";
  
  const groupedEquals = {};
  const groupedRegex = {};
  
  for (const t of tags) {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      if (!groupedRegex[k]) groupedRegex[k] = new Set();
      groupedRegex[k].add(esc(v));
    } else {
      const [k, v] = t.split("=");
      if (!groupedEquals[k]) groupedEquals[k] = new Set();
      groupedEquals[k].add(esc(v));
    }
  }

  const selectors = [];
  
  for (const [k, values] of Object.entries(groupedEquals)) {
    const v = Array.from(values).join("|");
    selectors.push(`nw["${k}"~"^(${v})$",i]${around};`);
  }
  
  for (const [k, values] of Object.entries(groupedRegex)) {
    const v = Array.from(values).join("|");
    selectors.push(`nw["${k}"~"(${v})",i]${around};`);
  }

  const limit = 1000;
  const query = `[out:json][timeout:50]${bboxString};(${selectors.join("")});out center ${limit};`;
  console.log("Query:", query);
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response len:", text.length);
  if (res.status !== 200) console.log(text.substring(0, 500));
  else {
    const j = JSON.parse(text);
    console.log("Elements:", j.elements ? j.elements.length : 0);
  }
}
test();
