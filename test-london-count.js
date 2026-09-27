async function test() {
  const query = `[out:json][timeout:30];
    nwr["shop"="bakery"]["contact:instagram"](51.4874, -0.1477, 51.5274, -0.1077);
    out center 300;`;
    
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: "data=" + encodeURIComponent(query)
  });
  const json = await res.json();
  console.log("Elements:", json.elements.length);
}
test();
