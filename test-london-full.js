const CATEGORIAS = [
  { id: "barbearia", label: "Barbearias", tags: ["shop=hairdresser", "shop~barber"] },
  { id: "construtora", label: "Construtoras e Reformas", tags: ["craft=builder", "craft=plasterer", "craft=roofer", "craft=carpenter", "shop=doityourself", "office=construction_company", "craft=painter"] },
  { id: "acaiteria", label: "Acaiterias e Smoothies", tags: ["shop=deli", "cuisine~acai", "shop=juice", "amenity=cafe"] },
  { id: "sorveteria", label: "Sorveterias e Gelaterias", tags: ["amenity=ice_cream", "shop=confectionery", "cuisine~ice_cream"] },
  { id: "academia", label: "Academias e CrossFit", tags: ["leisure=fitness_centre", "leisure=sports_centre", "sport~fitness|crossfit", "leisure=stadium"] },
  { id: "restaurante", label: "Restaurantes", tags: ["amenity=restaurant"] },
  { id: "pizzaria", label: "Pizzarias", tags: ["amenity=restaurant", "cuisine~pizza"] },
  { id: "cafe", label: "Cafeterias", tags: ["amenity=cafe"] },
  { id: "salao", label: "Saloes de Beleza", tags: ["shop=beauty", "shop=hairdresser"] },
  { id: "petshop", label: "Pet Shops e Banho", tags: ["shop=pet", "shop=pet_grooming"] },
  { id: "mecanica", label: "Oficinas Mecanicas", tags: ["shop=car_repair"] },
  { id: "floricultura", label: "Floriculturas", tags: ["shop=florist"] },
  { id: "padaria", label: "Padarias", tags: ["shop=bakery"] },
  { id: "otica", label: "Oticas", tags: ["shop=optician"] },
  { id: "farmacia", label: "Farmacias de Bairro", tags: ["amenity=pharmacy"] },
  { id: "cervejaria", label: "Cervejarias e Bares", tags: ["amenity=pub", "amenity=bar", "craft=brewery"] },
  { id: "dentista", label: "Clinicas Odontologicas", tags: ["amenity=dentist", "healthcare=dentist"] },
  { id: "advogado", label: "Escritorios de Advocacia", tags: ["office=lawyer"] },
  { id: "contabilidade", label: "Contabilidades", tags: ["office=accountant", "office=tax_advisor"] },
  { id: "imobiliaria", label: "Imobiliarias", tags: ["office=estate_agent"] },
  { id: "supermercado", label: "Supermercados e Conveniencias", tags: ["shop=supermarket", "shop=convenience"] },
  { id: "roupas", label: "Lojas de Roupas e Calcados", tags: ["shop=clothes", "shop=shoes", "shop=boutique"] },
  { id: "medico", label: "Clinicas Medicas", tags: ["amenity=clinic", "amenity=doctors"] },
  { id: "hospital", label: "Hospitais", tags: ["amenity=hospital"] },
  { id: "tatuagem", label: "Estudios de Tatuagem", tags: ["shop=tattoo"] },
  { id: "tecnologia", label: "Agencias e TI", tags: ["office=it", "office=advertising_agency"] },
  { id: "eletronicos", label: "Eletronicos e Celulares", tags: ["shop=electronics", "shop=mobile_phone", "shop=computer"] },
  { id: "escola", label: "Escolas e Cursos", tags: ["amenity=school", "amenity=language_school"] },
  { id: "concessionaria", label: "Concessionarias", tags: ["shop=car", "shop=motorcycle"] },
  { id: "lavajato", label: "Lava Jatos", tags: ["amenity=car_wash"] },
  { id: "hotel", label: "Hoteis e Pousadas", tags: ["tourism=hotel", "tourism=guest_house", "tourism=hostel"] },
  { id: "joalheria", label: "Joalherias", tags: ["shop=jewelry"] },
  { id: "papelaria", label: "Papelarias", tags: ["shop=stationery"] },
  { id: "moveis", label: "Lojas de Moveis", tags: ["shop=furniture", "shop=interior_decoration"] }
];

async function test() {
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  const bbox = [ 51.2867601, -0.5103751, 51.6918741, 0.3340155 ];
  const limit = 1000;
  
  let bboxString = `[bbox:${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}]`;
  let around = "";
  
  const selectors = tags.map((t) => {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      return `nw["${k}"~"${v}",i]${around};`;
    }
    const [k, v] = t.split("=");
    return `nw["${k}"="${v}"]${around};`;
  });
  
  const query = `[out:json][timeout:50]${bboxString};(${selectors.join("")});out center ${limit};`;
  console.log("Query length:", query.length);
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Result length:", text.length);
  if (res.status !== 200) {
     console.log("Error response:", text.substring(0, 1000));
  } else {
     const json = JSON.parse(text);
     console.log("Elements:", json.elements ? json.elements.length : 0);
  }
}
test();
