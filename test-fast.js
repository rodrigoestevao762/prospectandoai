async function test() {
  const bb = [51.2867601,-0.5103751,51.6918741,0.3340155]; // London
  let bboxString = `[bbox:${bb[0]},${bb[1]},${bb[2]},${bb[3]}]`;
  // Just ask for the keys!
  const query = `[out:json][timeout:50]${bboxString};(nw["shop"];nw["amenity"];nw["craft"];nw["office"];nw["leisure"];nw["tourism"];nw["healthcare"];);out center 1000;`;
  
  const t0 = Date.now();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "ProspectAI/1.0" },
    body: `data=${encodeURIComponent(query)}`
  });
  
  const text = await res.text();
  const t1 = Date.now();
  console.log(`Time: ${(t1-t0)/1000}s`);
  if (res.status === 200) {
    const j = JSON.parse(text);
    console.log(`Elements: ${j.elements ? j.elements.length : 0}`);
    if (j.remark) console.log("Remark:", j.remark);
  } else {
    console.log(`ERROR ${res.status}: ${text.substring(0, 100)}`);
  }
}
test();
