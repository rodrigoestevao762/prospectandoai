const CATEGORIAS = [
  { id: "barbearia", label: "Barbearias", tags: ["shop=hairdresser", "shop~barber"] },
  { id: "restaurante", label: "Restaurantes", tags: ["amenity=restaurant"] }
];

async function test() {
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  const bbox = [ 51.2867601, -0.5103751, 51.6918741, 0.3340155 ];
  const limit = 1000;
  
  let bboxString = `[bbox:${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}]`;
  let around = "";
  
  const selectors = tags.map((t) => {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      return `nw["${k}"~"${v}",i]${around};`;
    }
    const [k, v] = t.split("=");
    return `nw["${k}"="${v}"]${around};`;
  });
  
  const query = `[out:json][timeout:50]${bboxString};(${selectors.join("")});out center ${limit};`;
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  if (res.status === 200) {
     console.log("Elements:", JSON.parse(text).elements.length);
  } else {
     console.log("Response:", text.substring(0, 300));
  }
}
test();
