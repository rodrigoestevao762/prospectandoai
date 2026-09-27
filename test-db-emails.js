const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { isEmailValidoParaB2B } = require('./lib/validar-email');

async function test() {
  const { data } = await sb.from('leads').select('email').not('email', 'is', null).limit(100);
  if (!data) return console.log("No data");
  
  let invalidos = 0;
  for (const row of data) {
    if (!isEmailValidoParaB2B(row.email)) {
      console.log("BLOCKED:", row.email);
      invalidos++;
    } else {
      console.log("VALID:", row.email);
    }
  }
  console.log(`\nBlocked ${invalidos} out of ${data.length}`);
}
test();
