"use client";

export type LeadStored = {
  id: string;
  osmId?: string;
  osm_id?: string;
  nome: string;
  categoria: string;
  cidade: string;
  pais: string;
  lat?: number | null;
  lng?: number | null;
  telefone: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  facebook?: string | null;
  endereco?: string;
  score: number;
  nivel: "quente" | "morno" | "frio";
  status: "novo" | "mensagem_gerada" | "enviado" | "respondido" | "cliente";
  canal?: "email" | "dm" | null;
  notas?: string | null;
  fontes?: string[];
  criado_em?: string;
  atualizado_em?: string;
};

const DB_NAME = "prospectai_db";
const STORE_NAME = "leads_store";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("osmId", "osmId", { unique: false });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("score", "score", { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function salvarLeads(leadsParaSalvar: any[]): Promise<{ sucesso: boolean; salvos: number }> {
  if (!leadsParaSalvar || leadsParaSalvar.length === 0) {
    return { sucesso: true, salvos: 0 };
  }

  const agora = new Date().toISOString();
  const leadsFormatados: LeadStored[] = leadsParaSalvar.map((item) => {
    const osmId = item.osmId || item.osm_id || String(item.id || Date.now() + Math.random());
    const id = item.id && !item.id.startsWith("osm_") ? item.id : "lead_" + osmId.replace(/\D/g, "") + "_" + Math.random().toString(36).substring(2, 6);

    return {
      id,
      osmId,
      osm_id: osmId,
      nome: item.nome || "Empresa Sem Nome",
      categoria: item.categoria || "Geral",
      cidade: item.cidade || "",
      pais: item.pais || "Brasil",
      lat: item.lat || null,
      lng: item.lng || null,
      telefone: item.telefone || null,
      website: item.website || null,
      instagram: item.instagram || null,
      email: item.email || null,
      facebook: item.facebook || null,
      endereco: item.endereco || "",
      score: item.score || 50,
      nivel: item.nivel || "morno",
      status: item.status || "novo",
      canal: item.canal || null,
      notas: item.notas || "",
      fontes: [item.fonte || "osm"],
      criado_em: item.criado_em || agora,
      atualizado_em: agora,
    };
  });

  // 1. Salva no IndexedDB do navegador
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      for (const lead of leadsFormatados) {
        store.put(lead);
      }
    }
  } catch (err) {
    console.warn("IndexedDB fallback warning:", err);
  }

  // 2. Sincroniza com a API persistente do backend (/api/leads)
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leads: leadsFormatados }),
    });
    if (res.ok) {
      const json = await res.json();
      return { sucesso: true, salvos: json.salvos || leadsFormatados.length };
    }
  } catch (err) {
    console.warn("API leads sync warning:", err);
  }

  return { sucesso: true, salvos: leadsFormatados.length };
}

export async function listarLeads(): Promise<LeadStored[]> {
  let leadsApi: LeadStored[] = [];

  // 1. Tenta carregar do backend (/api/leads)
  try {
    const res = await fetch("/api/leads", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.leads) && json.leads.length > 0) {
        leadsApi = json.leads;
      }
    }
  } catch (err) {
    console.warn("Falha ao buscar leads via API:", err);
  }

  // 2. Tenta carregar do IndexedDB do navegador
  let leadsIdb: LeadStored[] = [];
  try {
    const db = await openDB();
    if (db) {
      leadsIdb = await new Promise<LeadStored[]>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }
  } catch (err) {
    console.warn("IndexedDB read warning:", err);
  }

  // 3. Mescla os dois conjuntos com deduplicação por chave única
  const map = new Map<string, LeadStored>();
  for (const l of [...leadsIdb, ...leadsApi]) {
    const key = l.osmId || l.osm_id || l.id || (l.nome + "::" + (l.endereco || l.cidade));
    map.set(key, l);
  }

  const resultado = Array.from(map.values());
  resultado.sort((a, b) => (b.score || 0) - (a.score || 0) || a.nome.localeCompare(b.nome));
  return resultado;
}

export async function atualizarLead(id: string, campos: Partial<LeadStored>): Promise<boolean> {
  // 1. Atualiza no IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const existing = getReq.result;
        if (existing) {
          store.put({ ...existing, ...campos, atualizado_em: new Date().toISOString() });
        }
      };
    }
  } catch {}

  // 2. Atualiza via API
  try {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campos }),
    });
  } catch {}

  return true;
}

export async function excluirLead(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
    }
  } catch {}

  try {
    await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {}

  return true;
}

export async function obterIdsSalvos(): Promise<Set<string>> {
  const leads = await listarLeads();
  const set = new Set<string>();
  for (const l of leads) {
    if (l.osmId) set.add(l.osmId);
    if (l.osm_id) set.add(l.osm_id);
    if (l.id) set.add(l.id);
  }
  return set;
}
