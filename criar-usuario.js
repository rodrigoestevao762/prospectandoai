const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function criarUsuario() {
  const { data, error } = await supabase.auth.signUp({
    email: 'matheusbernardolopessantana@gmail.com',
    password: '18022010',
  });
  
  if (error) {
    console.error('Erro ao criar usurio:', error.message);
  } else {
    console.log('Usurio criado com sucesso:', data.user.email);
  }
}

criarUsuario();
