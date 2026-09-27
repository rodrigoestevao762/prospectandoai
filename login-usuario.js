const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function loginUsuario() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'matheusbernardolopessantana@gmail.com',
    password: '18022010',
  });
  
  if (error) {
    console.error('Erro ao logar:', error.message);
  } else {
    console.log('Login efetuado com sucesso:', data?.session?.access_token ? 'SIM' : 'NAO');
  }
}

loginUsuario();
