async function test() {
  const query = `[out:json];node(1);out;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log(res.status);
  console.log(await res.text());
}
test();
