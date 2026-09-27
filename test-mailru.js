async function testAllExact() {
  const CATEGORIAS = [
    { id: "barbearia", tags: ["shop=hairdresser", "shop~barber"] },
    { id: "restaurante", tags: ["amenity=restaurant"] }
  ];
  const latC = 51.5074;
  const lonC = -0.1278;
  const maxDelta = 0.03;
  const s = latC - maxDelta/2;
  const n = latC + maxDelta/2;
  const w = lonC - maxDelta/2;
  const e = lonC + maxDelta/2;
  const bboxString = `[bbox:${s},${w},${n},${e}]`;
  const query = `[out:json][timeout:90]${bboxString};(nw["amenity"="restaurant"];);out center 1000;`;
  
  const res = await fetch("https://maps.mail.ru/osm/tools/overpass/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  console.log(`mail.ru -> ${res.status}: ${text.substring(0, 100)}`);
}
testAllExact();
