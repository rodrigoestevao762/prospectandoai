const tags = ["office=architect", "amenity=veterinary", "shop=beauty", "amenity=coworking_space", "shop=hardware", "amenity=driving_school", "shop=alcohol", "shop=travel_agency", "shop=copyshop", "shop=photo", "amenity=events_venue", "office=insurance", "shop=hairdresser", "craft=builder", "cuisine=acai", "amenity=ice_cream", "leisure=fitness_centre", "amenity=restaurant", "cuisine=pizza", "amenity=cafe", "shop=pet", "shop=car_repair", "shop=florist", "shop=bakery", "shop=optician", "amenity=pharmacy", "amenity=pub", "amenity=dentist", "office=lawyer", "office=accountant", "office=estate_agent", "shop=supermarket", "shop=clothes", "amenity=clinic", "amenity=hospital", "shop=tattoo", "office=it", "shop=electronics", "amenity=school", "shop=car", "amenity=car_wash", "tourism=hotel", "shop=jewelry", "shop=stationery", "shop=furniture"];

const selectors = tags.map(t => {
  if (t.includes("=")) {
    const [k, v] = t.split("=");
    return `nwr["${k}"="${v}"];`;
  }
  return `nwr["${t}"];`;
});

const query = `[out:json][timeout:25][bbox:53.7,-1.6,53.9,-1.4];(${selectors.join("")});out center 300;`;
console.log(query.substring(0, 200) + "...");

async function test() {
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log("Status:", res.status, "Time:", Date.now() - t0);
  if (!res.ok) console.log(await res.text());
}
test();
