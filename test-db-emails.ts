import { createClient } from "@supabase/supabase-js";
import { isEmailValidoParaB2B } from "./lib/validar-email";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data } = await sb.from("leads").select("email").not("email", "is", null).limit(200);
  if (!data) return console.log("No data");
  
  let validos = 0;
  let invalidos = 0;
  for (const row of data) {
    if (!row.email) continue;
    if (row.email.includes("duckduckgo.com")) continue;
    
    if (isEmailValidoParaB2B(row.email)) {
      validos++;
    } else {
      console.log("BLOCKED:", row.email);
      invalidos++;
    }
  }
  console.log(`\nValid: ${validos}, Blocked: ${invalidos}`);
}
test();
