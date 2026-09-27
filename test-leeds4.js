const query = `[out:json][timeout:25][bbox:53.7,-1.6,53.9,-1.4];(
  nwr["amenity"~"veterinary|coworking_space|driving_school|events_venue|restaurant|cafe|pub|dentist|clinic|hospital|school|car_wash|pharmacy"];
);out center 300;`;

async function test() {
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "ProspectAI/1.0 (prospeccao de empresas)",
      "Accept": "*/*"
    },
    body: "data=" + encodeURIComponent(query)
  });
  console.log("Status:", res.status, "Time:", Date.now() - t0);
  if (!res.ok) console.log(await res.text());
}
test();
