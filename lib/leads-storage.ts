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

const DB_NAME = "prospectai_db_v2";
const STORE_NAME = "leads_store";
const DB_VERSION = 1;
const LS_BACKUP_KEY = "prospectai_leads_cache";

function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        try {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
            store.createIndex("osmId", "osmId", { unique: false });
            store.createIndex("status", "status", { unique: false });
            store.createIndex("score", "score", { unique: false });
          }
        } catch {}
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function getLocalStorageLeads(): LeadStored[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_BACKUP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalStorageLeads(leads: LeadStored[]) {
  if (typeof window === "undefined") return;
  try {
    // Guarda os últimos 1000 leads no backup de emergência do localStorage
    const slice = leads.slice(0, 1000);
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(slice));
  } catch {}
}

export async function salvarLeads(leadsParaSalvar: any[]): Promise<{ sucesso: boolean; salvos: number }> {
  if (!leadsParaSalvar || !Array.isArray(leadsParaSalvar) || leadsParaSalvar.length === 0) {
    return { sucesso: true, salvos: 0 };
  }

  const agora = new Date().toISOString();
  const leadsFormatados: LeadStored[] = leadsParaSalvar.map((item) => {
    const osmId = String(item.osmId || item.osm_id || Date.now() + "_" + Math.random().toString(36).substring(2, 6));
    const id = item.id && !item.id.startsWith("osm_") ? String(item.id) : "lead_" + osmId.replace(/\D/g, "") + "_" + Math.random().toString(36).substring(2, 6);

    const nivelValido: "quente" | "morno" | "frio" = 
      item.nivel === "quente" || item.nivel === "morno" || item.nivel === "frio" ? item.nivel : "morno";

    const statusValido: "novo" | "mensagem_gerada" | "enviado" | "respondido" | "cliente" =
      ["novo", "mensagem_gerada", "enviado", "respondido", "cliente"].includes(item.status) ? item.status : "novo";

    return {
      id,
      osmId,
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
      nivel: nivelValido,
      status: statusValido,
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

  // 2. Salva no backup do localStorage
  try {
    const currentLs = getLocalStorageLeads();
    const map = new Map<string, LeadStored>();
    for (const l of currentLs) {
      if (l) map.set(l.osmId || l.id, l);
    }
    for (const l of leadsFormatados) {
      if (l) map.set(l.osmId || l.id, l);
    }
    saveLocalStorageLeads(Array.from(map.values()));
  } catch {}

  // 3. Sincroniza com a API persistente do backend (/api/leads)
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leads: leadsFormatados }),
    });
    if (res.ok) {
      const json = await res.json().catch(() => ({}));
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
      const json = await res.json().catch(() => ({}));
      if (json && Array.isArray(json.leads)) {
        leadsApi = json.leads;
      }
    }
  } catch {}

  // 2. Tenta carregar do IndexedDB
  let leadsIdb: LeadStored[] = [];
  try {
    const db = await openDB();
    if (db) {
      leadsIdb = await new Promise<LeadStored[]>((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
          req.onerror = () => resolve([]);
        } catch {
          resolve([]);
        }
      });
    }
  } catch {}

  // 3. Carrega backup do localStorage
  const leadsLs = getLocalStorageLeads();

  // 4. Mescla os três conjuntos com deduplicação
  const map = new Map<string, LeadStored>();
  for (const l of [...leadsLs, ...leadsIdb, ...leadsApi]) {
    if (!l) continue;
    const key = String(l.osmId || l.osm_id || l.id || ((l.nome || "") + "::" + (l.endereco || l.cidade || "")));
    map.set(key, l);
  }

  const resultado = Array.from(map.values());
  resultado.sort((a, b) => {
    const scoreDiff = (b.score || 0) - (a.score || 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (a.nome || "").localeCompare(b.nome || "");
  });

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

  // 2. Atualiza no backup do localStorage
  try {
    const ls = getLocalStorageLeads();
    const updated = ls.map((l) => (l.id === id || l.osmId === id ? { ...l, ...campos } : l));
    saveLocalStorageLeads(updated);
  } catch {}

  // 3. Atualiza via API
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
    const ls = getLocalStorageLeads();
    const updated = ls.filter((l) => l.id !== id && l.osmId !== id);
    saveLocalStorageLeads(updated);
  } catch {}

  try {
    await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {}

  return true;
}

export async function obterIdsSalvos(): Promise<Set<string>> {
  try {
    const leads = await listarLeads();
    const set = new Set<string>();
    if (Array.isArray(leads)) {
      for (const l of leads) {
        if (!l) continue;
        if (l.osmId) set.add(String(l.osmId));
        if (l.osm_id) set.add(String(l.osm_id));
        if (l.id) set.add(String(l.id));
      }
    }
    return set;
  } catch {
    return new Set<string>();
  }
}
