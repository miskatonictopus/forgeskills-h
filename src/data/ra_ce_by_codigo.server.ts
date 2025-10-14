// src/data/ra_ce_by_codigo.server.ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getRAyCEByAsignaturaServer } from "./ra_ce.server";

export async function getRAyCEByCodigoServer(codigoInput: string) {
  const norm = String(codigoInput ?? "").trim().replace(/\D/g, "");
  if (!norm) return [];
  const padded = norm.padStart(4, "0");
  const noPad = String(Number(norm));

  const supabase = supabaseAdmin();

  // 1) Obtener el UUID real de la asignatura por código (acepta 0488 y 488)
  const { data: asg, error: eAsg } = await supabase
    .from("asignaturas")
    .select("id_uuid")
    .or(`codigo.eq.${padded},codigo.eq.${noPad}`)
    .maybeSingle();

  if (eAsg) {
    console.error("❌ getRAyCEByCodigoServer: asignaturas error:", eAsg.message);
    return [];
  }
  if (!asg?.id_uuid) {
    console.warn("⚠️ getRAyCEByCodigoServer: asignatura no encontrada para", { padded, noPad });
    return [];
  }

  // 2) Reusar la función por UUID (seguro y simple)
  return getRAyCEByAsignaturaServer(asg.id_uuid);
}
