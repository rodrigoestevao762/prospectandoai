async function test() {
  const res = await fetch("https://maps.mail.ru/osm/tools/overpass/api/interpreter", {
    method: "OPTIONS",
    headers: {
      "Origin": "https://hardz-leads.vercel.app",
      "Access-Control-Request-Method": "POST"
    }
  });
  console.log("CORS Headers:", res.headers.get("access-control-allow-origin"));
}
test();
