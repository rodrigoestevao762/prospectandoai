export const maxDuration = 60;

import { NextResponse } from "next/server";

const ENDPOINTS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

export async function POST(req: Request) {
  try {
    const { query, attemptIndex = 0 } = await req.json();
    if (!query) {
      return NextResponse.json({ erro: "Query ausente" }, { status: 400 });
    }

    const UA = "Overpass Turbo/1.0 (https://overpass-turbo.eu)";

    for (let i = 0; i < ENDPOINTS.length; i++) {
      const ep = ENDPOINTS[(attemptIndex + i) % ENDPOINTS.length];
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": UA,
          },
          body: "data=" + encodeURIComponent(query),
          signal: AbortSignal.timeout(28000),
        });

        if (!res.ok) continue;

        const data = await res.json();
        if (data && Array.isArray(data.elements)) {
          return NextResponse.json({ elements: data.elements });
        }
      } catch {
        // Tenta o próximo espelho do cluster Overpass
        continue;
      }
    }

    return NextResponse.json({ elements: [] });
  } catch (err: any) {
    return NextResponse.json({ erro: err.message, elements: [] }, { status: 500 });
  }
}

