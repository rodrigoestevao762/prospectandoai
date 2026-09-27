async function test() {
  const bboxString = '[bbox:49.4478587,5.7356988,50.1827989,6.5312481]';
  const query = `[out:json][timeout:120]${bboxString};(nwr["leisure"~"fitness_centre"];nwr["leisure"~"sports_centre"];nwr["sport"~"fitness"];nwr["sport"~"crossfit"];nwr["leisure"~"stadium"];);out center 300;`;
    
  console.log("Fetching...");
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log(res.status);
  const text = await res.text();
  console.log("Time:", Date.now() - t0);
  if (text.length > 500) console.log(text.substring(0, 500) + "...");
  else console.log(text);
}
test();
