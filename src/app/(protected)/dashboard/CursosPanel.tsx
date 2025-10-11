"use client";

import * as React from "react";
import { EntityCreateDialog, type FieldConfig, type FormValues } from "@/components/EntityCreateDialog";
import { crearCurso, listarCursos, type Curso } from "@/data/cursos.repo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

/* ========= Campos ========= */

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

const asignaturaFields: ReadonlyArray<FieldConfig> = [
  { name: "codigo", label: "Código (JSON remoto)", type: "text", required: true, placeholder: "0490 / 0612 ..." },
  { name: "nombre", label: "Nombre (opcional)", type: "text", placeholder: "Se rellenará desde el JSON" },
  { name: "color",  label: "Color", type: "text", placeholder: "#A3E635" },
];

/* ========= Panel ========= */

export default function CursosPanel() {
  const [openCurso, setOpenCurso] = React.useState(false);
  const [openAsignatura, setOpenAsignatura] = React.useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = React.useState<Curso | null>(null);

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
      const message =
        e instanceof Error ? e.message : typeof e === "string" ? e : "No se pudo cargar cursos.";
      console.error(e);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void refetch(); }, [refetch]);

  /* ====== Crear curso ====== */
  const handleSubmitCurso = async (values: FormValues) => {
    setError(null);
    await crearCurso({
      acronimo: String(values.acronimo ?? "").trim(),
      nombre:   String(values.nombre ?? "").trim(),
      nivel:    String(values.nivel ?? "").trim(),
      grado:    String(values.grado ?? "").trim(),
    });
    await refetch();
    setOpenCurso(false);
  };

  /* ====== Crear asignatura (import RA/CE y vincular al curso) ====== */
  const handleSubmitAsignatura = async (values: FormValues) => {
    if (!cursoSeleccionado) {
      toast.error("Selecciona un curso antes de crear la asignatura.");
      return;
    }
    const codigo = String(values.codigo ?? "").trim();
    if (!codigo) {
      toast.error("Introduce el código de la asignatura (del JSON remoto).");
      return;
    }

    // 1) Importar en backend: crea la asignatura (si no existe) e inserta RA/CE
    const res = await fetch("/api/asignaturas/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo }),
    });
    const data = await res.json();
    if (!data.ok) {
      toast.error(data.error ?? "No se pudo importar la asignatura.");
      return;
    }

    // 2) Vincular a curso en tabla curso_asignaturas
    const supabase = supabaseBrowser();
    // Recuperar id de la asignatura recién importada por nombre (el endpoint devuelve 'asignatura' = nombre)
    const { data: asig, error: selErr } = await supabase
      .from("asignaturas")
      .select("id")
      .eq("nombre", data.asignatura)
      .maybeSingle();

    if (selErr || !asig?.id) {
      console.error(selErr);
      toast.error("Asignatura importada, pero no pude recuperarla para vincularla al curso.");
      return;
    }

    // Insert relación (ignora duplicado si ya existía)
    const { error: relErr } = await supabase
  .from("curso_asignaturas")
  .upsert(
    { curso_id: cursoSeleccionado.id, asignatura_id: asig.id },
    { onConflict: "curso_id,asignatura_id" }
  );

    toast.success(`"${data.asignatura}" importada (RA/CE) y vinculada a ${cursoSeleccionado.acronimo}.`);
    setOpenAsignatura(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setOpenCurso(true)}>+ Nuevo curso</Button>
      </div>

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
              <div className="flex items-center justify-between gap-2">
                <div>
                  <b>{c.acronimo}</b> — {c.nombre}
                  <span className="text-sm text-muted-foreground">
                    {" "} (Nivel {c.nivel}, {c.grado})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCursoSeleccionado(c);
                      setOpenAsignatura(true);
                    }}
                  >
                    + Añadir asignatura
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Dialogo: crear curso */}
      <EntityCreateDialog
        open={openCurso}
        onOpenChange={setOpenCurso}
        title="Nuevo curso"
        description="Guarda un curso en la BD local (Supabase Docker)."
        fields={cursoFields}
        submitLabel="Guardar curso"
        loadingText="Guardando..."
        onSubmit={handleSubmitCurso}
      />

      {/* Dialogo: crear asignatura (import RA/CE) */}
      <EntityCreateDialog
        open={openAsignatura}
        onOpenChange={setOpenAsignatura}
        title={`Nueva asignatura${cursoSeleccionado ? ` en ${cursoSeleccionado.acronimo}` : ""}`}
        description="Importará RA y CE desde el JSON remoto y la vinculará al curso."
        fields={asignaturaFields}
        submitLabel="Importar e insertar"
        loadingText="Importando…"
        onSubmit={handleSubmitAsignatura}
      />
    </section>
  );
}
