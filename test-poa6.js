async function test() {
  const query = `[out:json][timeout:120][bbox:-30.13,-51.33,-29.93,-51.13];(nwr["amenity"="driving_school"];);out center 300;`;
    
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
