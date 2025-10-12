// components/asignaturas/AsociarCursoButton.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { listarCursos } from "@/data/cursos.repo";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Props = {
  asignaturaId: string;         // UUID de la asignatura
  onLinked?: () => void;        // p.ej. router.refresh()
};

type Option = { value: string; label: string };

export function AsociarCursoButton({ asignaturaId, onLinked }: Props) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen((prev) => (prev === next ? prev : next));
  }, []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [options, setOptions] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [cursoId, setCursoId] = useState<string>("");

  // Carga opciones desde el repo (igual que en CursosPanel)
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingOptions(true);
        setError(null);
        const cursos = await listarCursos(); // ← usa vuestro repo existente
        const opts: Option[] = cursos.map((c: any) => ({
          value: c.id,
          label: `${c.acronimo}${c.nivel ?? ""} — ${c.nombre}`,
        }));
        setOptions(opts);
      } catch (e: any) {
        setError(
          e?.message ?? "No se pudieron cargar los cursos desde la base de datos."
        );
        setOptions([]);
      } finally {
        setLoadingOptions(false);
      }
    })();
  }, [open]);

  const canSubmit = useMemo(
    () => !!cursoId && !saving && !loadingOptions,
    [cursoId, saving, loadingOptions]
  );

  // Relaciona directamente en Supabase (mismo patrón que en CursosPanel)
  async function handleSubmit() {
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = supabaseBrowser();
      const { error: relErr } = await supabase
        .from("curso_asignaturas")
        .upsert(
          { curso_id: cursoId, asignatura_id: asignaturaId },
          { onConflict: "curso_id,asignatura_id" }
        );

      if (relErr) throw relErr;

      setOk("Curso asociado correctamente.");
      handleOpenChange(false);
      setCursoId("");
      onLinked?.();
    } catch (e: any) {
      setError(e?.message ?? "Error al asociar el curso.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => handleOpenChange(true)}>
          Asociar curso
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asociar curso a la asignatura</DialogTitle>
            <DialogDescription>
              Elige un curso y crearemos la relación en la base de datos.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Curso</label>
              <select
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                disabled={loadingOptions || saving}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">
                  {loadingOptions ? "Cargando..." : "Selecciona un curso..."}
                </option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="whitespace-pre-wrap text-xs text-red-400">{error}</p>
            )}
            {ok && <p className="text-xs text-emerald-400">{ok}</p>}

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={!canSubmit}>
                {saving ? "Asociando…" : "Relacionar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
