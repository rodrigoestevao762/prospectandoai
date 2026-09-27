const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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
