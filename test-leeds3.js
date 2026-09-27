const query = `[out:json][timeout:25][bbox:53.7,-1.6,53.9,-1.4];(
  nwr["amenity"~"veterinary|coworking_space|driving_school|events_venue|restaurant|cafe|pub|dentist|clinic|hospital|school|car_wash|pharmacy"];
  nwr["shop"~"beauty|hardware|alcohol|travel_agency|copyshop|photo|hairdresser|pet|car_repair|florist|bakery|optician|supermarket|clothes|tattoo|electronics|car|jewelry|stationery|furniture"];
  nwr["office"~"architect|insurance|lawyer|accountant|estate_agent|it"];
  nwr["craft"~"builder"];
  nwr["cuisine"~"acai|pizza"];
  nwr["leisure"~"fitness_centre"];
  nwr["tourism"~"hotel"];
);out center 300;`;

async function test() {
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log("Status:", res.status, "Time:", Date.now() - t0);
  if (res.ok) {
     const data = await res.json();
     console.log("Elements:", data.elements.length);
  }
}
test();
