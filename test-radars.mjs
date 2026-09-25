import { radarFoods, radarInstagram } from './lib/enrichment.js';

async function test() {
  console.log("Iniciando radarFoods...");
  const foods = await radarFoods("restaurante", "São Paulo");
  console.log("Foods encontrados:", foods.length);
  console.log(foods.slice(0, 2));

  console.log("Iniciando radarInstagram...");
  const insta = await radarInstagram("restaurante", "São Paulo");
  console.log("Insta encontrados:", insta.length);
  console.log(insta.slice(0, 2));
}

test().catch(console.error);
