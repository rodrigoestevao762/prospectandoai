async function test() {
  const query = `[out:json][timeout:25][bbox:33.7,-84.4,33.9,-84.2];(nwr["amenity"="restaurant"]["delivery"~"yes|only"];);out center 300;`;
    
  console.log("Fetching Foods...");
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log(res.status);
  const text = await res.text();
  console.log("Time:", Date.now() - t0);
  console.log(text.substring(0, 300));
}
test();
