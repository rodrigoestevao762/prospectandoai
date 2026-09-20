import fs from 'fs';

let content = fs.readFileSync('lib/enrichment.ts', 'utf-8');
content = content.replace(
  'export async function enriquecerLead(nome: string, cidade: string)',
  'export async function enrichLeadData(nome: string, cidade: string, pais: string = "")'
);
fs.writeFileSync('lib/enrichment.ts', content);

