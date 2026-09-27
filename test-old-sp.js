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

async function testOldSp() {
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  const latC = -23.5505; // São Paulo
  const lonC = -46.6333;
  // Full Bbox for São Paulo (approx)
  const s = -24.00;
  const n = -23.35;
  const w = -46.85;
  const e = -46.35;
  const bboxString = `[bbox:${s},${w},${n},${e}]`;
  
  const groupedEquals = {};
  const groupedRegex = {};
  for (const t of tags) {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      if (!groupedRegex[k]) groupedRegex[k] = new Set();
      groupedRegex[k].add(esc(v));
    } else {
      const [k, v] = t.split("=");
      if (!groupedEquals[k]) groupedEquals[k] = new Set();
      groupedEquals[k].add(esc(v));
    }
  }

  const selectors = [];
  for (const [k, values] of Object.entries(groupedEquals)) {
    const v = Array.from(values).join("|");
    selectors.push(`nw["${k}"~"^(${v})$",i];`);
  }
  for (const [k, values] of Object.entries(groupedRegex)) {
    const v = Array.from(values).join("|");
    selectors.push(`nw["${k}"~"(${v})",i];`);
  }
  
  const query = `[out:json][timeout:50]${bboxString};(${selectors.join("")});out center 10000;`;
  
  const res = await fetch("https://maps.mail.ru/osm/tools/overpass/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  if (res.status === 200) {
    const j = JSON.parse(text);
    console.log(`OLD SP SUCCESS: ${j.elements ? j.elements.length : 0} items`);
  } else {
    console.log(`ERROR ${res.status}: ${text.substring(0, 100)}`);
  }
}
testOldSp();
