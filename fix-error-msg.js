const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/ultErro = json\.erro;/, `ultErro = json.erro || "Erro na resposta do servidor";`);
c = c.replace(/sucessos \+= sucessosLote;\s+localStorage\.setItem\(storageKey, \(enviadosHoje \+ sucessos\)\.toString\(\)\);\s+setLeads/, 
`sucessos += sucessosLote;
              localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());
              
              const errosMtp = json.resultados?.filter((r: any) => !r.ok && r.erro).map((r: any) => r.erro);
              if (errosMtp && errosMtp.length > 0 && sucessosLote === 0) {
                ultErro = errosMtp[0];
              }

              setLeads`);

fs.writeFileSync('app/app/page.tsx', c);
