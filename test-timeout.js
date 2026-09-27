async function test() {
  const bb = [51.2867601,-0.5103751,51.6918741,0.3340155];
  let bboxString = `[bbox:${bb[0]},${bb[1]},${bb[2]},${bb[3]}]`;
  // Let's put a bunch of tags
  const tags = ["shop=hairdresser", "amenity=restaurant", "shop=car_repair", "amenity=cafe", "shop=bakery"];
  const selectors = tags.map(t => { const [k,v] = t.split("="); return `nw["${k}"="${v}"];` });
  const query = `[out:json][timeout:1]${bboxString};(${selectors.join("")});out center 1000;`;
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Text:", text.substring(0, 500));
}
test();
