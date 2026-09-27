async function testFastClamped() {
  const latC = 51.5074;
  const lonC = -0.1278;
  const maxDelta = 0.03;
  const s = latC - maxDelta/2;
  const n = latC + maxDelta/2;
  const w = lonC - maxDelta/2;
  const e = lonC + maxDelta/2;
  const bboxString = `[bbox:${s},${w},${n},${e}]`;
  
  // Just ask for the base keys!
  const query = `[out:json][timeout:90]${bboxString};(nw["shop"];nw["amenity"];nw["craft"];nw["office"];nw["leisure"];nw["tourism"];nw["healthcare"];nw["sport"];);out center 10000;`;
  
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
testFastClamped();
