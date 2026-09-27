async function test() {
  const bb = [51.2867601,-0.5103751,51.6918741,0.3340155];
  let bboxString = `[bbox:${bb[0]},${bb[1]},${bb[2]},${bb[3]}]`;
  const query = `[out:json][timeout:50]${bboxString};(nw["shop"="hairdresser"];);out center 100;`;
  
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Text:", text.substring(0, 500));
}
test();
