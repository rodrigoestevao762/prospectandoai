const CATEGORIAS = [
  { id: "barbearia", label: "Barbearias", tags: ["shop=hairdresser", "shop~barber"] },
  { id: "construtora", label: "Construtoras e Reformas", tags: ["craft=builder", "craft=plasterer", "craft=roofer", "craft=carpenter", "shop=doityourself", "office=construction_company", "craft=painter"] },
  { id: "acaiteria", label: "Açaiterias e Smoothies", tags: ["shop=deli", "cuisine~acai", "shop=juice", "amenity=cafe"] },
  { id: "sorveteria", label: "Sorveterias e Gelaterias", tags: ["amenity=ice_cream", "shop=confectionery", "cuisine~ice_cream"] },
  { id: "academia", label: "Academias e CrossFit", tags: ["leisure=fitness_centre", "leisure=sports_centre", "sport~fitness|crossfit", "leisure=stadium"] },
  { id: "restaurante", label: "Restaurantes", tags: ["amenity=restaurant"] },
  { id: "pizzaria", label: "Pizzarias", tags: ["amenity=restaurant", "cuisine~pizza"] },
  { id: "cafe", label: "Cafeterias", tags: ["amenity=cafe"] },
  { id: "salao", label: "Salões de Beleza", tags: ["shop=beauty", "shop=hairdresser"] },
  { id: "petshop", label: "Pet Shops e Banho", tags: ["shop=pet", "shop=pet_grooming"] },
  { id: "mecanica", label: "Oficinas Mecânicas", tags: ["shop=car_repair"] },
  { id: "floricultura", label: "Floriculturas", tags: ["shop=florist"] },
  { id: "padaria", label: "Padarias", tags: ["shop=bakery"] },
  { id: "otica", label: "Óticas", tags: ["shop=optician"] },
  { id: "farmacia", label: "Farmácias de Bairro", tags: ["amenity=pharmacy"] },
  { id: "cervejaria", label: "Cervejarias e Bares", tags: ["amenity=pub", "amenity=bar", "craft=brewery"] },
  { id: "dentista", label: "Clínicas Odontológicas", tags: ["amenity=dentist", "healthcare=dentist"] },
  { id: "advogado", label: "Escritórios de Advocacia", tags: ["office=lawyer"] },
  { id: "contabilidade", label: "Contabilidades", tags: ["office=accountant", "office=tax_advisor"] },
  { id: "imobiliaria", label: "Imobiliárias", tags: ["office=estate_agent"] },
  { id: "supermercado", label: "Supermercados e Conveniências", tags: ["shop=supermarket", "shop=convenience"] },
  { id: "roupas", label: "Lojas de Roupas e Calçados", tags: ["shop=clothes", "shop=shoes", "shop=boutique"] },
  { id: "medico", label: "Clínicas Médicas", tags: ["amenity=clinic", "amenity=doctors"] },
  { id: "hospital", label: "Hospitais", tags: ["amenity=hospital"] },
  { id: "tatuagem", label: "Estúdios de Tatuagem", tags: ["shop=tattoo"] },
  { id: "tecnologia", label: "Agências e TI", tags: ["office=it", "office=advertising_agency"] },
  { id: "eletronicos", label: "Eletrônicos e Celulares", tags: ["shop=electronics", "shop=mobile_phone", "shop=computer"] },
  { id: "escola", label: "Escolas e Cursos", tags: ["amenity=school", "amenity=language_school"] },
  { id: "concessionaria", label: "Concessionárias", tags: ["shop=car", "shop=motorcycle"] },
  { id: "lavajato", label: "Lava Jatos", tags: ["amenity=car_wash"] },
  { id: "hotel", label: "Hotéis e Pousadas", tags: ["tourism=hotel", "tourism=guest_house", "tourism=hostel"] },
  { id: "joalheria", label: "Joalherias", tags: ["shop=jewelry"] },
  { id: "papelaria", label: "Papelarias", tags: ["shop=stationery"] },
  { id: "moveis", label: "Lojas de Móveis", tags: ["shop=furniture", "shop=interior_decoration"] }
];
function esc(s) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

async function testAllMailru() {
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
  
  const res = await fetch("https://maps.mail.ru/osm/tools/overpass/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  const text = await res.text();
  console.log(`mail.ru -> ${res.status}: ${text.substring(0, 100)}`);
}
testAllMailru();
