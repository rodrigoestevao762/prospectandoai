const CATEGORIAS = [
  { id: "barbearia", tags: ["shop=hairdresser", "shop=barber"] },
  { id: "construtora", tags: ["craft=builder", "craft=plasterer", "craft=roofer", "craft=carpenter", "shop=doityourself", "office=construction_company", "craft=painter"] },
  { id: "acaiteria", tags: ["shop=deli", "cuisine=acai", "shop=juice", "amenity=cafe"] },
  { id: "sorveteria", tags: ["amenity=ice_cream", "shop=confectionery", "cuisine=ice_cream"] },
  { id: "academia", tags: ["leisure=fitness_centre", "leisure=sports_centre", "sport=fitness", "sport=crossfit", "leisure=stadium"] },
  { id: "restaurante", tags: ["amenity=restaurant"] },
  { id: "pizzaria", tags: ["amenity=restaurant", "cuisine=pizza"] },
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

async function testFullLondonExact() {
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  // Full London bbox
  const s = 51.2867601;
  const n = 51.6918741;
  const w = -0.5103751;
  const e = 0.3340155;
  const bboxString = `[bbox:${s},${w},${n},${e}]`;
  
  const selectors = tags.map((t) => {
    const [k, v] = t.split("=");
    return `nw["${k}"="${esc(v)}"];`;
  });
  
  const query = `[out:json][timeout:90]${bboxString};(${selectors.join("")});out center 10000;`;
  
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
  ];
  
  for (const url of endpoints) {
    const t0 = Date.now();
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
        body: `data=${encodeURIComponent(query)}`
      });
      const text = await res.text();
      if (res.status === 200) {
        const j = JSON.parse(text);
        console.log(`${url} -> ${res.status}: ${j.elements ? j.elements.length : 0} items in ${(Date.now()-t0)/1000}s`);
      } else {
        console.log(`${url} -> ERROR ${res.status} in ${(Date.now()-t0)/1000}s`);
      }
    } catch (err) {
      console.log(`${url} -> Failed in ${(Date.now()-t0)/1000}s: ${err.message}`);
    }
  }
}
testFullLondonExact();
