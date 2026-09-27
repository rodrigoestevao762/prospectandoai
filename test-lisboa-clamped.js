async function test() {
  // Clamped bbox for Lisboa (lat: 38.707, lon: -9.136)
  const latC = 38.7077507;
  const lonC = -9.1365919;
  const maxDelta = 0.05;
  const s = latC - maxDelta/2;
  const n = latC + maxDelta/2;
  const w = lonC - maxDelta/2;
  const e = lonC + maxDelta/2;
  
  const query = `[out:json][timeout:50][bbox:${s},${w},${n},${e}];(nw["shop"~"^(hairdresser|doityourself|deli|juice|confectionery|beauty|pet|pet_grooming|car_repair|florist|bakery|optician|supermarket|convenience|clothes|shoes|boutique|tattoo|electronics|mobile_phone|computer|car|motorcycle|jewelry|stationery|furniture|interior_decoration)$",i];nw["amenity"~"^(ice_cream|cafe|restaurant|pub|bar|pharmacy|dentist|clinic|doctors|hospital|school|language_school|car_wash)$",i];);out center 1000;`;
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  if (res.status === 200) {
    console.log("Elements:", JSON.parse(text).elements.length);
  } else {
    console.log("Error:", text.substring(0, 500));
  }
}
test();
