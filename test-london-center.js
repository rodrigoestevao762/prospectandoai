async function test() {
  // Center: 51.5074, -0.1277. maxDelta: 0.04. 
  // bbox: s=51.4874, n=51.5274, w=-0.1477, e=-0.1077
  const query = `[out:json][timeout:30];
    nwr["shop"="bakery"]["contact:instagram"](51.4874, -0.1477, 51.5274, -0.1077);
    out center 300;`;
    
  console.log("Fetching...");
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log(res.status);
  const text = await res.text();
  console.log("Time:", Date.now() - t0);
  console.log(text.substring(0, 500));
}
test();
