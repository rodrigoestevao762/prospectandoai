async function test() {
  const t0 = Date.now();
  console.log("Calling local API...");
  try {
    const res = await fetch("http://localhost:3005/api/buscar-insta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nicho: "Barbearias", cidade: "Atlanta", limit: 300 })
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Data length:", json.data ? json.data.length : null);
    console.log("Error:", json.error);
    console.log("Time:", Date.now() - t0, "ms");
  } catch (err) {
    console.error(err);
  }
}
test();
