const { CATEGORIAS } = require('./lib/categorias');
const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
const bbox = [53.7, -1.6, 53.9, -1.4]; // Leeds approx

const selectors = tags.map(t => {
  if (t.includes("=")) {
    const [k, v] = t.split("=");
    return `nwr["${k}"="${v}"];`;
  }
  if (t.includes("~")) {
    const [k, v] = t.split("~");
    return `nwr["${k}"~"${v}"];`;
  }
  return `nwr["${t}"];`;
});

const query = `[out:json][timeout:25][bbox:53.7,-1.6,53.9,-1.4];(${selectors.join("")});out center 300;`;
console.log(query.substring(0, 200) + "...");
console.log("Total selectors:", selectors.length);

async function test() {
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query)
  });
  console.log("Status:", res.status, "Time:", Date.now() - t0);
}
test();
