async function test() {
  const cidade = "Londres";
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ProspectAI' }});
  const data = await res.json();
  console.log(data);
}
test();
