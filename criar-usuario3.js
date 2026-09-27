const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function criarUsuario() {
  const { data, error } = await supabase.auth.signUp({
    email: 'matheusbernardolopessantana@gmail.com',
    password: '18022010',
  });
  
  if (error) {
    console.error('Erro ao criar usuario:', error.message);
  } else {
    console.log('Usuario criado com sucesso:', data?.user?.email);
  }
}

criarUsuario();
