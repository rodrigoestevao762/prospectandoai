const OWNER_EMAIL = "rodrigoestevao762@gmail.com";

export function isAuthorizedEmail(email: string | undefined | null): boolean {
  if (!email) return false;

  const configuredEmails = (process.env.AUTHORIZED_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const allowedEmails = new Set([OWNER_EMAIL, ...configuredEmails]);

  return allowedEmails.has(email.trim().toLowerCase());
}
