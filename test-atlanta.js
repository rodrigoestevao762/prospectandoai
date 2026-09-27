require('ts-node').register();
const { radarInstagram } = require('./lib/enrichment');

async function test() {
  console.log("Starting Radar Insta...");
  const t0 = Date.now();
  try {
    const leads = await radarInstagram("Barbearias", "Atlanta", 300);
    console.log(`Found ${leads.length} leads in ${Date.now() - t0}ms`);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
