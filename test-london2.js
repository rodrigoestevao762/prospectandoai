async function test() {
  const query = `[out:json][timeout:30];
    nwr["shop"="bakery"]["contact:instagram"~"."](51.3, -0.5, 51.7, 0.5);
    out center 10;`;
    
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
  console.log(text.substring(0, 500));
}
test();
