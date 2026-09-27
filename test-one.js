async function test() {
  const query = `[out:json][timeout:50][bbox:51.2867601,-0.5103751,51.6918741,0.3340155];(nw["amenity"="restaurant"];);out center 1000;`;
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  const t1 = Date.now();
  console.log(`Time: ${(t1-t0)/1000}s`);
  if (res.status === 200) {
    console.log(`Elements: ${JSON.parse(text).elements.length}`);
  } else {
    console.log(`ERROR ${res.status}: ${text.substring(0, 100)}`);
  }
}
test();
