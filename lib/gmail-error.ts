/** Converts Gmail's WebLoginRequired SMTP response into an actionable message. */
export function mensagemErroEmail(error: unknown): string {
  const e = error as { message?: string; responseCode?: number; code?: string } | null;
  const raw = e?.message || "Falha no provedor de e-mail (Gmail)";
  const exigeLoginWeb = e?.responseCode === 534 || /534[\s\S]{0,120}(5\.7\.[0-9]+|WebLoginRequired)|WebLoginRequired|log in with your web browser/i.test(raw);

  if (exigeLoginWeb) {
    return "O Google bloqueou o acesso SMTP (534-5.7.9). Entre no Gmail desta conta pelo navegador, conclua qualquer verificação de segurança e tente novamente. Se continuar, gere uma nova Senha de app com a verificação em duas etapas ativa e atualize-a nas Configurações do ProspectandoAI. Use a Senha de app, nunca a senha normal da conta.";
  }

  return raw;
}

export function exigePausaDoLote(error: unknown): boolean {
  const e = error as { message?: string; responseCode?: number } | null;
  const raw = e?.message || "";
  return e?.responseCode === 534 || e?.responseCode === 421 ||
    /WebLoginRequired|log in with your web browser|Too many login attempts|Invalid login|\b535\b|\b421\b/i.test(raw);
}
