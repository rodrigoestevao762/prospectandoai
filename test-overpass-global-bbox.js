async function test() {
  const query = `[out:json][timeout:50][bbox:38.6913994,-9.2298356,38.7967584,-9.0863328];(nw["shop"~"^(hairdresser|beauty|pet|florist|bakery)$",i];nw["amenity"~"^(restaurant|cafe|bar)$",i];);out center 10;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Result length:", text.length);
}
test();
