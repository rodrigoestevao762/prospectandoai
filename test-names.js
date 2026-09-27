const fs = require('fs');
async function test() {
  const query = `[out:json][timeout:50][bbox:38.6913994,-9.2298356,38.7967584,-9.0863328];(nw["shop"~"^(hairdresser|doityourself|deli|juice|confectionery|beauty|pet|pet_grooming|car_repair|florist|bakery|optician|supermarket|convenience|clothes|shoes|boutique|tattoo|electronics|mobile_phone|computer|car|motorcycle|jewelry|stationery|furniture|interior_decoration)$",i];nw["amenity"~"^(ice_cream|cafe|restaurant|pub|bar|pharmacy|dentist|clinic|doctors|hospital|school|language_school|car_wash)$",i];);out center 1000;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  const j = JSON.parse(text);
  const elements = j.elements || [];
  let names = 0;
  for (const e of elements) {
    if (e.tags && e.tags.name) names++;
  }
  console.log("Total Elements:", elements.length);
  console.log("Elements with name:", names);
}
test();
