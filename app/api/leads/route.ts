import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

// No ambiente serverless da Vercel, apenas /tmp é gravável
const DATA_DIR = process.env.VERCEL || process.env.NODE_ENV === "production"
  ? os.tmpdir()
  : path.join(process.cwd(), ".data");

const LEADS_FILE = path.join(DATA_DIR, "prospectai_leads.json");

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, "[]", "utf-8");
    }
  } catch (e) {
    // Falha silenciosa em ambientes ultra-restritos
  }
}

function readLeads(): any[] {
  try {
    ensureDataFile();
    if (fs.existsSync(LEADS_FILE)) {
      const raw = fs.readFileSync(LEADS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
}

function writeLeads(leads: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Falha ao salvar leads no disco:", err);
  }
}

export async function GET() {
  try {
    const leads = readLeads();
    return NextResponse.json({ ok: true, leads, total: leads.length });
  } catch (err: any) {
    return NextResponse.json({ ok: true, leads: [], total: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const leadsToSave: any[] = Array.isArray(body?.leads) ? body.leads : body?.lead ? [body.lead] : [];

    if (leadsToSave.length === 0) {
      return NextResponse.json({ ok: true, salvos: 0, total: 0 });
    }

    const currentLeads = readLeads();
    const map = new Map<string, any>();

    for (const l of currentLeads) {
      if (!l) continue;
      const key = String(l.osmId || l.osm_id || l.id || ((l.nome || "") + "::" + (l.endereco || l.cidade || "")));
      map.set(key, l);
    }

    let novos = 0;
    const agora = new Date().toISOString();

    for (const item of leadsToSave) {
      if (!item) continue;
      const osmId = String(item.osmId || item.osm_id || Date.now() + "_" + Math.random().toString(36).substring(2, 6));
      const key = osmId || ((item.nome || "") + "::" + (item.endereco || item.cidade || ""));

      const existing = map.get(key);
      const leadFormatado = {
        id: existing?.id || (item.id && !item.id.startsWith("osm_") ? item.id : "lead_" + osmId.replace(/\D/g, "") + "_" + Math.random().toString(36).substring(2, 6)),
        osmId: osmId,
        osm_id: osmId,
        nome: String(item.nome || "Empresa Sem Nome"),
        categoria: String(item.categoria || "Geral"),
        cidade: String(item.cidade || ""),
        pais: String(item.pais || "Brasil"),
        lat: item.lat || null,
        lng: item.lng || null,
        telefone: item.telefone || null,
        website: item.website || null,
        instagram: item.instagram || null,
        email: item.email || null,
        facebook: item.facebook || null,
        endereco: String(item.endereco || ""),
        score: typeof item.score === "number" ? item.score : 50,
        nivel: item.nivel === "quente" || item.nivel === "morno" || item.nivel === "frio" ? item.nivel : "morno",
        status: existing?.status || item.status || "novo",
        canal: existing?.canal || item.canal || null,
        notas: existing?.notas || item.notas || "",
        fontes: existing?.fontes || [item.fonte || "osm"],
        criado_em: existing?.criado_em || agora,
        atualizado_em: agora,
      };

      if (!existing) novos++;
      map.set(key, leadFormatado);
    }

    const updatedList = Array.from(map.values());
    writeLeads(updatedList);

    return NextResponse.json({
      ok: true,
      salvos: leadsToSave.length,
      novos,
      total: updatedList.length,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, campos } = body;
    if (!id || !campos) {
      return NextResponse.json({ ok: false, error: "ID e campos são obrigatórios" }, { status: 400 });
    }

    const currentLeads = readLeads();
    let modificado = false;

    const updatedList = currentLeads.map((l) => {
      if (l.id === id || l.osmId === id || l.osm_id === id) {
        modificado = true;
        return {
          ...l,
          ...campos,
          atualizado_em: new Date().toISOString(),
        };
      }
      return l;
    });

    if (modificado) {
      writeLeads(updatedList);
    }

    return NextResponse.json({ ok: true, modificado });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID é obrigatório" }, { status: 400 });
    }

    const currentLeads = readLeads();
    const filtered = currentLeads.filter((l) => l.id !== id && l.osmId !== id && l.osm_id !== id);
    writeLeads(filtered);

    return NextResponse.json({ ok: true, total: filtered.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
