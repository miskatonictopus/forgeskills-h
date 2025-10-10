import { supabaseBrowser } from "@/lib/supabaseBrowser";

export type Curso = {
  id: string;
  acronimo: string;
  nombre: string;
  nivel: string;
  grado: string;
  created_at?: string | null;
};

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

export async function listarCursos(): Promise<Curso[]> {
  const supabase = supabaseBrowser();

  // 🔎 Evitamos el .order() (está disparando "No suitable key or wrong key type")
  const { data, error } = await supabase
    .from("cursos")
    .select("id, acronimo, nombre, nivel, grado, created_at");

  if (error) {
    // No rompas el render: dejamos log y devolvemos []
    console.error("listarCursos error:", error);
    return [];
  }

  // 🧮 Orden estable en cliente
  return (data ?? []).sort((a, b) =>
    (a.acronimo || "").localeCompare(b.acronimo || "", "es", { sensitivity: "base" })
  ) as Curso[];
}
