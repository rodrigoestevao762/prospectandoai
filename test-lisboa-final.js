async function test() {
  const latC = 38.7077507;
  const lonC = -9.1365919;
  const maxDelta = 0.03;
  const s = latC - maxDelta/2;
  const n = latC + maxDelta/2;
  const w = lonC - maxDelta/2;
  const e = lonC + maxDelta/2;
  const bboxString = `[bbox:${s},${w},${n},${e}]`;
  
  const tags = ["shop=hairdresser", "shop~barber", "amenity=restaurant", "amenity=cafe", "shop=car_repair"];
  function esc(st) { return st.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }
  const selectors = tags.map((t) => {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      return `nw["${k}"~"${esc(v)}",i];`;
    }
    const [k, v] = t.split("=");
    return `nw["${k}"="${esc(v)}"];`;
  });
  
  const query = `[out:json][timeout:90]${bboxString};(${selectors.join("")});out center 1000;`;
  
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  const t1 = Date.now();
  
  if (res.status === 200) {
    const j = JSON.parse(text);
    console.log(`LISBOA EXACT BBOX SUCCESS: ${j.elements ? j.elements.length : 0} items in ${(t1-t0)/1000}s`);
  } else {
    console.log(`ERROR ${res.status}: ${text.substring(0, 100)}`);
  }
}
test();
