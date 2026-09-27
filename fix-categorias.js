const fs = require('fs');
let c = fs.readFileSync('lib/categorias.ts', 'utf8');

// Pizzaria: just cuisine=pizza, remove amenity=restaurant
c = c.replace(/\{ id: "pizzaria", label: "Pizzarias", tags: \["amenity=restaurant", "cuisine=pizza"\] \},/g, 
  '{ id: "pizzaria", label: "Pizzarias", tags: ["cuisine=pizza", "cuisine~pizza"] },');

// Acaiteria: just cuisine=acai, remove shop=deli, shop=juice, amenity=cafe
c = c.replace(/\{ id: "acaiteria", label: "Açaíterias e Smoothies", tags: \["shop=deli", "cuisine=acai", "shop=juice", "amenity=cafe"\] \},/g, 
  '{ id: "acaiteria", label: "Açaíterias e Smoothies", tags: ["cuisine=acai", "name~açai|acai|açaiteria,i"] },');

fs.writeFileSync('lib/categorias.ts', c);
