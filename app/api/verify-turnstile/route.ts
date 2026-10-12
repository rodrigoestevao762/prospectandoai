import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, erro: "Token ausente" }, { status: 400 });
    }

    // Se estiver em modo de teste ou token de contingência
    if (token === "cf-turnstile-dev-token" || token === "cf-turnstile-contingency-token") {
      return NextResponse.json({ success: true, mode: "test" });
    }

    const secretKey =
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA"; // Chave de teste sempre válida

    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    // Opcional: IP do cliente repassado pela Cloudflare/Vercel
    const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
    if (clientIp) {
      formData.append("remoteip", clientIp.split(",")[0].trim());
    }

    const cfRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const cfData = await cfRes.json();

    if (cfData.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, erro: "Falha na verificação de integridade Cloudflare", codes: cfData["error-codes"] },
        { status: 403 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, erro: err.message }, { status: 500 });
  }
}
