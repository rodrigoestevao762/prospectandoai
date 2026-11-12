import { CATEGORIAS } from "./categorias";

const TERMOS_NICHO = [
  "barbearia", "barbearias", "barber", "barbeiro", "cabelo", "cabeleireiro", "cabeleireira",
  "salao", "salão", "estetica", "estética", "spa", "unhas", "manicure", "pedicure",
  "restaurante", "restaurantes", "pizzaria", "pizzarias", "hamburgueria", "hamburguerias",
  "lanchonete", "lanchonetes", "cafe", "café", "cafeteria", "padaria", "padarias",
  "academia", "academias", "crossfit", "fitness", "pilates", "yoga",
  "dentista", "dentistas", "odontologia", "medico", "médico", "medicos", "médicos", "clinica", "clínica",
  "advogado", "advogados", "advocacia", "contabilidade", "contador", "imobiliaria", "imobiliária",
  "petshop", "pet shop", "veterinario", "veterinário", "veterinaria", "veterinária",
  "farmacia", "farmácia", "drogaria", "drogarias", "otica", "ótica",
  "oficina", "mecanica", "mecânica", "auto", "autopeças", "lavajato", "lava jato",
  "roupa", "roupas", "moda", "calcados", "calçados", "loja", "lojas", "comercio", "comércio",
  "mercado", "supermercado", "distribuidora", "deposito", "depósito", "construcao", "construção"
];

const ESTADOS_REGIOES = [
  "rio grande do sul", "rs", "porto alegre", "caxias do sul", "pelotas", "canoas", "santa maria",
  "sao paulo", "são paulo", "sp", "campinas", "guarulhos", "santos", "ribeirao preto",
  "rio de janeiro", "rj", "niteroi", "niterói",
  "minas gerais", "mg", "belo horizonte", "uberlandia",
  "parana", "paraná", "pr", "curitiba", "londrina", "maringa",
  "santa catarina", "sc", "florianopolis", "florianópolis", "joinville", "blumenau",
  "bahia", "ba", "salvador", "ceara", "ceará", "ce", "fortaleza", "pernambuco", "pe", "recife",
  "goias", "goiás", "go", "goiania", "goiânia", "distrito federal", "df", "brasilia", "brasília",
  "brasil", "brazil", "mundial", "global"
];

export function normalizarParametrosBusca(
  nichoInput: string,
  cidadeInput: string
): { nicho: string; cidade: string; invertido: boolean } {
  const n = (nichoInput || "").trim();
  const c = (cidadeInput || "").trim();

  const nLower = n.toLowerCase();
  const cLower = c.toLowerCase();

  const cidadePareceNicho =
    TERMOS_NICHO.some((t) => cLower.includes(t)) ||
    CATEGORIAS.some((cat) => cat.id === cLower || cat.label.toLowerCase().includes(cLower));

  const nichoPareceLocal =
    ESTADOS_REGIOES.some((reg) => nLower.includes(reg)) ||
    nLower.startsWith("em ") ||
    nLower.startsWith("no ") ||
    nLower.startsWith("na ");

  const nichoPareceNicho =
    TERMOS_NICHO.some((t) => nLower.includes(t)) ||
    CATEGORIAS.some((cat) => cat.id === nLower || cat.label.toLowerCase().includes(nLower));

  // Detecta inversão flagrante (ex: Nicho = "Rio Grande do Sul", Cidade = "Barbearias")
  if (cidadePareceNicho && (nichoPareceLocal || !nichoPareceNicho)) {
    return {
      nicho: c,
      cidade: n.replace(/^(em|no|na)\s+/i, ""),
      invertido: true,
    };
  }

  return {
    nicho: n,
    cidade: c,
    invertido: false,
  };
}
