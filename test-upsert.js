const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ndqppyrrkzrkllyuijjx.supabase.co', 'sb_publishable_XjRXh6fO4tDDqMA2x1054w_MJYmazPT');

async function test() {
  const { data, error } = await supabase.from('leads').upsert([{
    user_id: 'dummy', nome: 'Test', categoria: 'Test', cidade: 'Test', pais: 'Test',
    fonte: 'osm', osm_id: '12345', score: 10, nivel: 'frio'
  }], { onConflict: 'osm_id', ignoreDuplicates: true });
  console.log("Error:", error);
}
test();
