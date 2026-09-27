async function test() {
  const query = `[out:json][timeout:120][bbox:-30.2,-51.3,-29.9,-51.0];node(1);out;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log(await res.text());
}
test();
