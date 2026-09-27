async function test() {
  const query = `[out:json][timeout:120];[bbox:-30.2694499,-51.3034404,-29.9324744,-51.0188522];(nwr["amenity"="driving_school"];);out center 300;`;
    
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log(await res.text());
}
test();
