async function test() {
  const CATEGORIAS = [
    { id: "barbearia", tags: ["shop=hairdresser", "shop=barber"] },
    { id: "restaurante", tags: ["amenity=restaurant"] },
    { id: "cafe", tags: ["amenity=cafe"] },
    { id: "padaria", tags: ["shop=bakery"] },
    { id: "farmacia", tags: ["amenity=pharmacy"] },
    { id: "supermercado", tags: ["shop=supermarket", "shop=convenience"] },
    { id: "roupas", tags: ["shop=clothes", "shop=shoes", "shop=boutique"] }
  ];
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  const s = 51.2867601;
  const n = 51.6918741;
  const w = -0.5103751;
  const e = 0.3340155;
  const bboxString = `[bbox:${s},${w},${n},${e}]`;
  function esc(st) { return st.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }
  const selectors = tags.map((t) => {
    const [k, v] = t.split("=");
    return `nw["${k}"="${esc(v)}"];`;
  });
  const query = `[out:json][timeout:90]${bboxString};(${selectors.join("")});out center 10000;`;
  
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  console.log(`Status ${res.status} in ${(Date.now()-t0)/1000}s`);
  if (res.status === 200) {
    console.log(`Elements: ${JSON.parse(text).elements.length}`);
  }
}
test();
