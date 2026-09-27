async function test() {
  const query = `[out:json][timeout:10];node(51.5,-0.1,51.51,-0.09);out 10;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  console.log(res.status);
}
test();
