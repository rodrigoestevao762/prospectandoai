async function test() {
  const query = `[out:json][timeout:10];node(51.5,-0.1,51.51,-0.09);out 10;`;
  
  for (const url of [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter"
  ]) {
    try {
      const t0 = Date.now();
      const res = await fetch(url, { method: "POST", body: `data=${encodeURIComponent(query)}` });
      const text = await res.text();
      console.log(`${url} -> ${res.status} in ${Date.now()-t0}ms`);
    } catch (e) {
      console.log(`${url} -> ERROR ${e.message}`);
    }
  }
}
test();
