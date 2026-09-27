const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const replacements = [
  ['s? ATENaO: VocG esto', '?? ATENÇÃO: Você está'],
  ['s Enriquecer Lote', '?? Enriquecer Lote'],
  ['o% Disparo E-mails', '?? Disparo E-mails'],
  ['Y\\' Gerar Wpp', '?? Gerar Wpp'],
  ['Y" Gerar Insta', '?? Gerar Insta'],
  ['Y"~ Gerar FB', '?? Gerar FB'],
  ['Y-\\' s/ Insta', '??? s/ Insta'],
  ['s? Limpar Tudo', '?? Limpar Tudo'],
  ['s Enviar E-mail', '?? Enviar E-mail'],
  ['Y"? Enriquecer', '?? Enriquecer'],
  ['o% E-mail', '?? E-mail'],
  ['Y\\'', '??'],
  ['Y"', '??'],
  ['Y"~', '??'],
  ['Y-\\' Excluir', '??? Excluir'],
  ['o. copiado', '? copiado'],
  ['% Copiar', '?? Copiar'],
  ['o Landing', '?? Landing'],
  ['-Z ', '?? '],
  ['Y"', '??'],
  ['dirio', 'diário'],
  ['No ', 'Não '],
  ['Voc ', 'Você '],
  ['j ', 'já '],
  ['excludos', 'excluídos'],
  ['visvel', 'visível'],
  ['disponvel', 'disponível'],
  ['volido', 'válido'],
  ['atros', 'atrás'],
  ['jo ', 'já ']
];

replacements.forEach(([bad, good]) => {
  c = c.split(bad).join(good);
});

fs.writeFileSync('app/app/page.tsx', c);
