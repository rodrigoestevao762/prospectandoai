import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorMsg = searchParams.get("error_description") || searchParams.get("error");
  const next = searchParams.get("next") ?? "/app";

  // Obter o host público real repassado por proxies Cloudflare / Vercel
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";
  const baseUrl = isLocal
    ? origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : origin;

  if (errorMsg) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth&desc=${encodeURIComponent(errorMsg)}`);
  }

  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    } else {
      return NextResponse.redirect(`${baseUrl}/login?error=oauth&desc=${encodeURIComponent(error.message)}`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/login`);
}
