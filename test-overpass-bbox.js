async function test() {
  const limit = 1000;
  
  const selectors = [
    `nw["shop"];`,
    `nw["amenity"~"restaurant|cafe|fast_food|bar|pub"];`
  ];
  
  // bbox from nominatim: south, west, north, east
  const query = `[out:json][timeout:50][bbox:52.0262820,4.9700960,52.1420506,5.1951550];(${selectors.join("")});out center ${limit};`;
  console.log("Query:", query);
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Result length:", text.length);
  if (text.length > 500) {
    console.log(text.substring(0, 500));
  } else {
    console.log(text);
  }
}
test();
