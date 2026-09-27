import { CATEGORIAS } from './lib/categorias.ts';
function esc(s) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }
async function test() {
  const tags = Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
  const bb = [38.6913994,-9.2298356,38.7967584,-9.0863328]; // Lisboa bbox
  let bboxString = `[bbox:${bb[0]},${bb[1]},${bb[2]},${bb[3]}]`;
  let around = "";
  
  const groupedEquals = {};
  const groupedRegex = {};
  
  for (const t of tags) {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      if (!groupedRegex[k]) groupedRegex[k] = new Set();
      groupedRegex[k].add(esc(v));
    } else {
      const [k, v] = t.split("=");
      if (!groupedEquals[k]) groupedEquals[k] = new Set();
      groupedEquals[k].add(esc(v));
    }
  }

  const selectors = [];
  
  for (const [k, values] of Object.entries(groupedEquals)) {
    const v = Array.from(values).join("|");
    selectors.push(`nw["${k}"~"^(${v})$",i]${around};`);
  }
  
  for (const [k, values] of Object.entries(groupedRegex)) {
    const v = Array.from(values).join("|");
    selectors.push(`nw["${k}"~"(${v})",i]${around};`);
  }

  const query = `[out:json][timeout:50]${bboxString};(${selectors.join("")});out center 1000;`;
  console.log("Query length:", query.length);
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  if (res.status === 200) {
    console.log("Elements:", JSON.parse(text).elements.length);
  } else {
    console.log("Error:", text.substring(0, 500));
  }
}
test();
