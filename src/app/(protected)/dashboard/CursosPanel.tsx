"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { EntityCreateDialog, type FieldConfig, type FormValues } from "@/components/EntityCreateDialog";
import { crearCurso, listarCursos, type Curso } from "@/data/cursos.repo";

const cursoFields: ReadonlyArray<FieldConfig> = [
  { name: "acronimo", label: "Acrónimo", type: "text", required: true, placeholder: "SMX / ASIX / DAM / DAW" },
  { name: "nombre",   label: "Nombre",   type: "text", required: true, placeholder: "Sistemas Microinformáticos y Redes" },
  {
    name: "nivel", label: "Nivel", type: "select", required: true,
    options: [{ label: "1", value: "1" }, { label: "2", value: "2" }],
  },
  {
    name: "grado", label: "Grado", type: "select", required: true,
    options: [{ label: "medio", value: "medio" }, { label: "superior", value: "superior" }],
  },
];

export default function CursosPanel() {
  const [open, setOpen] = React.useState(false);
  const [cursos, setCursos] = React.useState<Curso[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listarCursos();
      setCursos(rows);
    } catch (e: unknown) {
      // Narrowing seguro
      const message =
        e instanceof Error ? e.message : typeof e === "string" ? e : "No se pudo cargar cursos.";
      console.error(e);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void refetch(); }, [refetch]);

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    await crearCurso({
      acronimo: String(values.acronimo ?? "").trim(),
      nombre:   String(values.nombre ?? "").trim(),
      nivel:    String(values.nivel ?? "").trim(),
      grado:    String(values.grado ?? "").trim(),
    });
    await refetch();
    setOpen(false);
  };

  return (
    <section className="space-y-4">
      {loading && <p>Cargando cursos…</p>}
      {error && (
        <p className="text-sm text-red-500">
          {error} — revisa la consola del navegador para más detalle.
        </p>
      )}

      {!loading && !error && cursos.length === 0 && (
        <p>No hay cursos en la base de datos.</p>
      )}

      {!loading && !error && cursos.length > 0 && (
        <ul className="space-y-2">
          {cursos.map((c: Curso) => (
            <li key={c.id} className="rounded-md border p-3">
              <b>{c.acronimo}</b> — {c.nombre}
              <span className="text-sm text-muted-foreground">
                {" "} (Nivel {c.nivel}, {c.grado})
              </span>
            </li>
          ))}
        </ul>
      )}

      <EntityCreateDialog
        open={open}
        onOpenChange={setOpen}
        title="Nuevo curso"
        description="Guarda un curso en la BD local (Supabase Docker)."
        fields={cursoFields}
        submitLabel="Guardar curso"
        loadingText="Guardando..."
        onSubmit={handleSubmit}
      />
    </section>
  );
}
