async function test() {
  const CATEGORIAS = [
    { id: "barbearia", tags: ["shop=hairdresser", "shop~barber"] },
    { id: "construtora", tags: ["craft=builder", "craft=plasterer", "craft=roofer", "craft=carpenter", "shop=doityourself", "office=construction_company", "craft=painter"] },
    { id: "acaiteria", tags: ["shop=deli", "cuisine~acai", "shop=juice", "amenity=cafe"] },
    { id: "sorveteria", tags: ["amenity=ice_cream", "shop=confectionery", "cuisine~ice_cream"] },
    { id: "academia", tags: ["leisure=fitness_centre", "leisure=sports_centre", "sport~fitness|crossfit", "leisure=stadium"] },
    { id: "restaurante", tags: ["amenity=restaurant"] },
    { id: "pizzaria", tags: ["amenity=restaurant", "cuisine~pizza"] },
    { id: "cafe", tags: ["amenity=cafe"] },
    { id: "salao", tags: ["shop=beauty", "shop=hairdresser"] },
    { id: "petshop", tags: ["shop=pet", "shop=pet_grooming"] },
    { id: "mecanica", tags: ["shop=car_repair"] },
    { id: "floricultura", tags: ["shop=florist"] },
    { id: "padaria", tags: ["shop=bakery"] },
    { id: "otica", tags: ["shop=optician"] },
    { id: "farmacia", tags: ["amenity=pharmacy"] },
    { id: "cervejaria", tags: ["amenity=pub", "amenity=bar", "craft=brewery"] },
    { id: "dentista", tags: ["amenity=dentist", "healthcare=dentist"] },
    { id: "advogado", tags: ["office=lawyer"] },
    { id: "contabilidade", tags: ["office=accountant", "office=tax_advisor"] },
    { id: "imobiliaria", tags: ["office=estate_agent"] },
    { id: "supermercado", tags: ["shop=supermarket", "shop=convenience"] },
    { id: "roupas", tags: ["shop=clothes", "shop=shoes", "shop=boutique"] },
    { id: "medico", tags: ["amenity=clinic", "amenity=doctors"] },
    { id: "hospital", tags: ["amenity=hospital"] },
    { id: "tatuagem", tags: ["shop=tattoo"] },
    { id: "tecnologia", tags: ["office=it", "office=advertising_agency"] },
    { id: "eletronicos", tags: ["shop=electronics", "shop=mobile_phone", "shop=computer"] },
    { id: "escola", tags: ["amenity=school", "amenity=language_school"] },
    { id: "concessionaria", tags: ["shop=car", "shop=motorcycle"] },
    { id: "lavajato", tags: ["amenity=car_wash"] },
    { id: "hotel", tags: ["tourism=hotel", "tourism=guest_house", "tourism=hostel"] },
    { id: "joalheria", tags: ["shop=jewelry"] },
    { id: "papelaria", tags: ["shop=stationery"] },
    { id: "moveis", tags: ["shop=furniture", "shop=interior_decoration"] }
  ];
  function esc(s) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }
  
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  const latC = 51.5074;
  const lonC = -0.1278;
  const maxDelta = 0.03;
  const s = latC - maxDelta/2;
  const n = latC + maxDelta/2;
  const w = lonC - maxDelta/2;
  const e = lonC + maxDelta/2;
  const bboxString = `[bbox:${s},${w},${n},${e}]`;
  
  const selectors = tags.map((t) => {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      return `nw["${k}"~"${esc(v)}",i];`;
    }
    const [k, v] = t.split("=");
    return `nw["${k}"="${esc(v)}"];`;
  });
  
  const query = `[out:json][timeout:90]${bboxString};(${selectors.join("")});out center 1000;`;
  
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
  ];
  
  for (const url of endpoints) {
    console.log(`Testing ${url}...`);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
        body: `data=${encodeURIComponent(query)}`
      });
      const text = await res.text();
      console.log(`Result ${res.status}: ${text.substring(0, 100)}`);
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }
}
test();
