async function test() {
  const query = `[out:json][timeout:120];
    (
      nwr["leisure"~"fitness_centre"](49.4478587,5.7356988,50.1827989,6.5312481);
      nwr["leisure"~"sports_centre"](49.4478587,5.7356988,50.1827989,6.5312481);
      nwr["sport"~"fitness"](49.4478587,5.7356988,50.1827989,6.5312481);
      nwr["sport"~"crossfit"](49.4478587,5.7356988,50.1827989,6.5312481);
      nwr["leisure"~"stadium"](49.4478587,5.7356988,50.1827989,6.5312481);
    );
    out center 300;`;
    
  console.log("Fetching...");
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  });
  console.log(res.status);
  const text = await res.text();
  console.log("Time:", Date.now() - t0);
  console.log(text.substring(0, 200));
}
test();
