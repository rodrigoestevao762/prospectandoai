async function test() {
  const bbox = [ 51.2867601, -0.5103751, 51.6918741, 0.3340155 ];
  const limit = 1000;
  let bboxString = `[bbox:${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}]`;
  
  // Grouped tags!
  const grouped = [
    `nw["shop"~"hairdresser|barber|doityourself|deli|juice|confectionery|beauty|pet|pet_grooming|car_repair|florist|bakery|optician|supermarket|convenience|clothes|shoes|boutique|tattoo|electronics|mobile_phone|computer|car|motorcycle|jewelry|stationery|furniture|interior_decoration"];`,
    `nw["amenity"~"ice_cream|cafe|restaurant|pub|bar|pharmacy|dentist|clinic|doctors|hospital|school|language_school|car_wash"];`,
    `nw["office"~"construction_company|lawyer|accountant|tax_advisor|estate_agent|it|advertising_agency"];`,
    `nw["craft"~"builder|plasterer|roofer|carpenter|painter|brewery"];`,
    `nw["leisure"~"fitness_centre|sports_centre|stadium"];`,
    `nw["tourism"~"hotel|guest_house|hostel"];`,
    `nw["healthcare"~"dentist"];`
  ];
  
  const query = `[out:json][timeout:50]${bboxString};(${grouped.join("")});out center ${limit};`;
  console.log("Query length:", query.length);
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  if (res.status === 200) {
     console.log("Elements:", JSON.parse(text).elements.length);
  } else {
     console.log("Response:", text.substring(0, 300));
  }
}
test();
