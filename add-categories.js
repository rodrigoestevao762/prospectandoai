const fs = require('fs');
let c = fs.readFileSync('lib/categorias.ts', 'utf8');

const novasCategorias = `
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
`;

c = c.replace(/export const CATEGORIAS: CategoriaDef\[\] = \[/, `export const CATEGORIAS: CategoriaDef[] = [\n${novasCategorias}`);

fs.writeFileSync('lib/categorias.ts', c);
