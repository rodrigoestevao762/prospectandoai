// Mapeamento: categoria amigável -> tags OpenStreetMap (Overpass)
// Adicionar novos tipos de negócio = adicionar uma entrada aqui.
export type CategoriaDef = {
  id: string;
  label: string;
  tags: string[]; // entradas Overpass: "key=value" ou "key~regex"
  idiomasHint?: string;
};

export const CATEGORIAS: CategoriaDef[] = [

  { id: "arquitetura", label: "Arquitetura e Interiores", tags: ["office=architect", "office=interior_design"] },
  { id: "veterinario", label: "Clínicas Veterinárias", tags: ["amenity=veterinary"] },
  { id: "estetica", label: "Clínicas de Estética e Spa", tags: ["shop=beauty", "leisure=spa", "healthcare=alternative"] },
  { id: "coworking", label: "Coworking e Escritórios", tags: ["amenity=coworking_space", "office=company"] },
  { id: "materiais_construcao", label: "Materiais de Construção", tags: ["shop=hardware", "shop=doityourself"] },
  { id: "autoescola", label: "Autoescolas", tags: ["amenity=driving_school"] },
  { id: "distribuidora_bebidas", label: "Distribuidoras de Bebidas", tags: ["shop=alcohol", "shop=beverages"] },
  { id: "turismo", label: "Agências de Turismo", tags: ["shop=travel_agency"] },
  { id: "grafica", label: "Gráficas e Comunicação Visual", tags: ["shop=copyshop", "craft=print_maker", "office=advertising_agency"] },
  { id: "fotografia", label: "Estúdios de Fotografia", tags: ["shop=photo", "craft=photographer", "shop=photo_studio"] },
  { id: "eventos", label: "Casas de Festas e Eventos", tags: ["amenity=events_venue", "leisure=dance"] },
  { id: "seguradora", label: "Corretores e Seguros", tags: ["office=insurance", "office=financial"] },

  { id: "barbearia", label: "Barbearias", tags: ["shop=hairdresser", "shop=barber"] },
  { id: "construtora", label: "Construtoras e Reformas", tags: ["craft=builder", "craft=plasterer", "craft=roofer", "craft=carpenter", "shop=doityourself", "office=construction_company", "craft=painter"] },
  { id: "acaiteria", label: "Açaíterias e Smoothies", tags: ["cuisine=acai", "name~açai|acai|açaiteria,i"] },
  { id: "sorveteria", label: "Sorveterias e Gelaterias", tags: ["amenity=ice_cream", "shop=confectionery", "cuisine=ice_cream"] },
  { id: "academia", label: "Academias e CrossFit", tags: ["leisure=fitness_centre", "leisure=sports_centre", "sport=fitness", "sport=crossfit", "leisure=stadium"] },
  { id: "restaurante", label: "Restaurantes", tags: ["amenity=restaurant"] },
  { id: "pizzaria", label: "Pizzarias", tags: ["cuisine=pizza", "cuisine~pizza"] },
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

export function getCategoria(id: string): CategoriaDef | undefined {
  return CATEGORIAS.find((c) => c.id === id);
}
