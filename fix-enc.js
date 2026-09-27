const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.split('s? ATENǟO: VocǦ estǭ').join('🚨 ATENÇÃO: Você está');
c = c.split('s Enriquecer Lote').join('🤖 Enriquecer Lote');
c = c.split('o% Disparo E-mails').join('🚀 Disparo E-mails');
c = c.split('Y\\\' Gerar Wpp').join('📱 Gerar Wpp');
c = c.split('Y" Gerar Insta').join('📸 Gerar Insta');
c = c.split('Y"~ Gerar FB').join('📘 Gerar FB');
c = c.split('Y-\\\' s/ Insta').join('🗑️ s/ Insta');
c = c.split('s? Limpar Tudo').join('🚨 Limpar Tudo');
c = c.split('s Enviar E-mail').join('🤖 Enviar E-mail');
c = c.split('Y"? Enriquecer').join('🔍 Enriquecer');
c = c.split('o% E-mail').join('✉️ E-mail');
c = c.split('Y-\\\' Excluir').join('🗑️ Excluir');
c = c.split('o. copiado').join('✅ copiado');
c = c.split('% Copiar').join('📋 Copiar');
c = c.split('o Landing').join('🌐 Landing');
c = c.split('Y\\\'').join('📱');
c = c.split('Y"').join('📸');
c = c.split('-Z').join('📍');

fs.writeFileSync('app/app/page.tsx', c);
