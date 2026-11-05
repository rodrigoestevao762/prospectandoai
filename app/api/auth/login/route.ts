import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    // Validação da credencial mestra do usuário
    if (email === "rodrigoestevao762@gmail.com" && password === "@Familia435") {
      const payload = {
        email: "rodrigoestevao762@gmail.com",
        id: "usr_rodrigoestevao762",
        role: "admin",
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 dias
      };

      const sessionToken = Buffer.from(JSON.stringify(payload)).toString("base64");
      const isProduction = process.env.NODE_ENV === "production";

      const response = NextResponse.json({
        ok: true,
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
      });

      response.cookies.set("prospect_session", sessionToken, {
        httpOnly: false, // acessível no client e server
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
      });

      return response;
    }

    return NextResponse.json(
      { ok: false, error: "Credenciais inválidas. Verifique seu e-mail e senha." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro no processamento de login" },
      { status: 500 }
    );
  }
}

