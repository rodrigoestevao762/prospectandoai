async function get() {
  const query = "pizzaria marguerita sao paulo";
  const r = await fetch(`https://duckduckgo.com/local.js?q=${encodeURIComponent(query)}&vqd=4-273572834723984`);
  console.log(r.status);
  const t = await r.text();
  console.log(t.substring(0, 300));
}
get();
