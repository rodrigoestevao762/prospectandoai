async function test() {
  const cidade = "Utrecht";
  const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cidade)}&format=json&addressdetails=1&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ProspectAI' }});
  const data = await res.json();
  console.log(data);
}
test();
