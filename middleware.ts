import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const isProduction = process.env.NODE_ENV === "production";

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              secure: isProduction,
              sameSite: "lax",
              path: "/",
            })
          );
        },
      },
    }
  );

  const { data } = await sb.auth.getUser();
  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login";
  const isPublic =
    path === "/" ||
    path.startsWith("/demo") ||
    path.startsWith("/s/") ||
    path.endsWith(".json") ||
    path.endsWith(".geojson") ||
    path.endsWith(".ico");

  // Lista de e-mails autorizados (rodrigoestevao762@gmail.com padrão + variáveis de ambiente)
  const userEmail = data?.user?.email?.toLowerCase() || "";
  const extraAllowed = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

  const isAuthorizedUser =
    userEmail === "rodrigoestevao762@gmail.com" ||
    (adminEmail && userEmail === adminEmail) ||
    extraAllowed.includes(userEmail) ||
    process.env.ALLOW_ALL_USERS === "true";

  // Se o usuário não está logado e tenta acessar página protegida
  if (!data.user && !isAuthPage && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Se logou com e-mail não autorizado, redireciona para o login com mensagem clara de segurança
  if (data.user && !isAuthorizedUser && !isAuthPage && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  // Se já está logado e autorizado e tenta entrar na página de login, leva direto ao dashboard
  if (data.user && isAuthorizedUser && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (auth callback route)
     * - api/ (API routes)
     * - static files (.png, .jpg, .json, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|api/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|mp4|json|geojson)$).*)"
  ],
};
