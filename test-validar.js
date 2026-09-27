const { isEmailValidoParaB2B } = require('./lib/validar-email');
console.log("contato@barbearia.com.br:", isEmailValidoParaB2B("contato@barbearia.com.br"));
console.log("barbearia@gmail.com:", isEmailValidoParaB2B("barbearia@gmail.com"));
console.log("padaria11999999999@gmail.com:", isEmailValidoParaB2B("padaria11999999999@gmail.com"));
console.log("admin@site.com:", isEmailValidoParaB2B("admin@site.com"));
