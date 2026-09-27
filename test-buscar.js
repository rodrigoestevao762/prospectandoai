async function test() {
  const url = "https://overpass-api.de/api/interpreter";
  const tags = ["shop", "amenity~restaurant|cafe|fast_food|bar|pub"];
  const bbox = [ 51.2867601, -0.5103751, 51.6918741, 0.3340155 ];
  const limit = 1000;
  
  let bboxString = `[bbox:${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}]`;
  let around = "";
  
  const selectors = tags.map((t) => {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      return `nw["${k}"~"${v}",i]${around};`;
    }
    const [k, v] = t.split("=");
    return `nw["${k}"="${v}"]${around};`;
  });
  
  const query = `[out:json][timeout:50]${bboxString};(${selectors.join("")});out center ${limit};`;
  console.log("Query:", query);
  
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const json = await res.json();
  console.log("Elements:", json.elements ? json.elements.length : 0);
  
  let count = 0;
  for (const el of json.elements || []) {
    const t = el.tags || {};
    if (!t.name) continue;
    count++;
  }
  console.log("With names:", count);
}
test();
