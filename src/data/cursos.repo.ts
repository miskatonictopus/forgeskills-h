// src/data/cursos.repo.ts
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export type Curso = {
  id: string;
  acronimo: string;
  nombre: string;
  nivel: string;
  grado: string;
  created_at?: string | null;
};

// ---------- CLIENTE (modal crea curso)
export async function crearCurso(input: Omit<Curso, "id" | "created_at">) {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from("cursos")
    .insert([input])
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Curso;
}

// ---------- CLIENTE (hooks en componentes client)
export async function listarCursos(): Promise<Curso[]> {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from("cursos")
    .select("id, acronimo, nombre, nivel, grado, created_at");
  if (error) {
    console.error("listarCursos error:", error);
    return [];
  }
  return (data ?? []).sort((a, b) =>
    (a.acronimo || "").localeCompare(b.acronimo || "", "es", { sensitivity: "base" })
  );
}

// ---------- SERVIDOR (para page.tsx)
export async function listarCursosServer(): Promise<Curso[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const url =
    `${base}/rest/v1/cursos` +
    `?select=id,acronimo,nombre,nivel,grado,created_at&order=acronimo.asc`;

  const res = await fetch(url, {
    headers: { apikey, Authorization: `Bearer ${apikey}` },
    cache: "no-store", // en dev; cambia por next:{revalidate:60} si quieres ISR
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status} al listar cursos`);
  }
  return (await res.json()) as Curso[];
}
