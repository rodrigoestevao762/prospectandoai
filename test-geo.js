const { geocodificar } = require('./lib/overpass.ts');
// Actually I can't require TS. I will just mock it.
async function test() {
  const q = "Londres";
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "User-Agent": "ProspectAI" } });
  const data = await res.json();
  const d = data[0];
  const bbox = String(d.boundingbox || "").split(",");
  let bb;
  if (bbox.length === 4) {
    bb = [parseFloat(bbox[0]), parseFloat(bbox[2]), parseFloat(bbox[1]), parseFloat(bbox[3])];
  }
  console.log("Bbox:", bb);
}
test();
