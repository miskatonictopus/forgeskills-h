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
  const [asignaturasPorCurso, setAsignaturasPorCurso] = React.useState<Record<string, any[]>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const supabase = supabaseBrowser();

  /* ========= Cargar cursos ========= */
  const refetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listarCursos();
      setCursos(rows);

      // 🔹 Por cada curso, traer asignaturas relacionadas
      const asigMap: Record<string, any[]> = {};
      for (const c of rows) {
        const { data: asigs, error } = await supabase
          .from("curso_asignaturas")
          .select(`
            asignatura_id,
            asignaturas!inner (
              codigo,
              nombre
            )
          `)
          .eq("curso_id", c.id);

        if (error) console.error("Error obteniendo asignaturas de", c.acronimo, error);
        asigMap[c.id] = asigs?.map((a) => a.asignaturas) ?? [];
      }
      setAsignaturasPorCurso(asigMap);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

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

    // 1️⃣ Importar desde el JSON remoto
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

    // 2️⃣ Vincularla al curso
    const { data: asig, error: selErr } = await supabase
      .from("asignaturas")
      .select("id_uuid")
      .eq("nombre", data.asignatura)
      .maybeSingle();

    if (selErr || !asig?.id_uuid) {
      console.error(selErr);
      toast.error("Asignatura importada, pero no se pudo vincular al curso.");
      return;
    }

    const { error: relErr } = await supabase
      .from("curso_asignaturas")
      .upsert(
        { curso_id: cursoSeleccionado.id, asignatura_id: asig.id_uuid },
        { onConflict: "curso_id,asignatura_id" }
      );

    if (relErr) {
      toast.error("Error al vincular asignatura: " + relErr.message);
      return;
    }

    toast.success(`"${data.asignatura}" vinculada a ${cursoSeleccionado.acronimo}.`);
    setOpenAsignatura(false);
    await refetch();
  };

  /* ========= Render ========= */
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setOpenCurso(true)}>+ Nuevo curso</Button>
      </div>

      {loading && <p>Cargando cursos…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && cursos.length > 0 && (
        <ul className="space-y-4">
          {cursos.map((c) => (
            <li key={c.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    {c.acronimo}{c.nivel}
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.nombre}</p>
                  <p className="text-xs uppercase text-muted-foreground">{c.grado}</p>
                </div>
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

              {/* 🔹 Asignaturas del curso */}
              <div className="mt-3 border-t pt-2">
                {asignaturasPorCurso[c.id]?.length ? (
                  <ul className="ml-3 list-disc text-sm">
                    {asignaturasPorCurso[c.id].map((a) => (
                      <li key={a.codigo}>
                        <b>{a.codigo}</b> — {a.nombre}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-red-400 mt-1">
                    ⚠️ Este curso no tiene asignaturas relacionadas todavía.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Diálogos */}
      <EntityCreateDialog
        open={openCurso}
        onOpenChange={setOpenCurso}
        title="Nuevo curso"
        description="Guarda un curso en la BD local."
        fields={cursoFields}
        submitLabel="Guardar curso"
        loadingText="Guardando..."
        onSubmit={handleSubmitCurso}
      />

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
