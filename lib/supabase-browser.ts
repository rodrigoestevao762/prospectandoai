import { createBrowserClient } from "@supabase/ssr";

export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ndqppyrrkzrkllyuijjx.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_XjRXh6fO4tDDqMA2x1054w_MJYmazPT";

  const client = createBrowserClient(url, key, {
    global: { headers: { "Accept-Profile": "public", "Content-Profile": "public" } },
  });

  const originalGetUser = client.auth.getUser.bind(client.auth);
  client.auth.getUser = async (jwt?: string) => {
    try {
      const res = await originalGetUser(jwt);
      if (res?.data?.user) return res;
    } catch {
      // Falha de rede / Supabase indisponível
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("prospect_user");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          return {
            data: {
              user: {
                id: user.id || "usr_rodrigoestevao762",
                email: user.email || "rodrigoestevao762@gmail.com",
              },
            },
            error: null,
          } as any;
        } catch {}
      }
    }
    return { data: { user: null }, error: null } as any;
  };

  return client;
}
