import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer() {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ndqppyrrkzrkllyuijjx.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_XjRXh6fO4tDDqMA2x1054w_MJYmazPT";

  return createServerClient(url, key, {
    global: { headers: { "Accept-Profile": "public", "Content-Profile": "public" } },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              secure: isProduction,
              sameSite: "lax",
              path: "/",
            })
          );
        } catch {
          // chamadas de servidor: middleware renova a sessão
        }
      },
    },
  });
}

export async function usuarioObrigatorio() {
  const cookieStore = await cookies();

  // 1. Validação prioritária de sessão master (prospect_session)
  const prospectSessionCookie = cookieStore.get("prospect_session")?.value;
  if (prospectSessionCookie) {
    try {
      const decoded = JSON.parse(Buffer.from(prospectSessionCookie, "base64").toString("utf-8"));
      if (decoded && decoded.email && (!decoded.exp || decoded.exp > Date.now())) {
        const adminUser = {
          id: decoded.id || "usr_rodrigoestevao762",
          email: decoded.email.toLowerCase(),
          role: "admin",
          aud: "authenticated",
          app_metadata: { provider: "email" },
          user_metadata: { role: "admin" },
          created_at: new Date().toISOString(),
        };
        const sb = await supabaseServer();
        return { sb, user: adminUser as any };
      }
    } catch {
      // Falha ao decodificar cookie de sessão, tenta fluxo padrão
    }
  }

  // 2. Validação padrão Supabase caso não haja sessão direta
  const sb = await supabaseServer();
  try {
    const { data } = await sb.auth.getUser();
    if (data?.user) return { sb, user: data.user };
  } catch {
    // Supabase indisponível
  }

  throw new Error("não autenticado");
}
