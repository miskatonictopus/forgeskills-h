// components/asignaturas/AsociarCursoButton.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EntityCreateDialog,
  FieldConfig,
  FormValues,
} from "@/components/EntityCreateDialog";

type Props = {
  asignaturaId: string;
  onLinked?: () => void; // router.refresh() o recarga de lista
};

type Option = { value: string; label: string };

export function AsociarCursoButton({ asignaturaId, onLinked }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // Opciones para el <select>
  const [options, setOptions] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Carga inicial de cursos cuando se abre el diálogo
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingOptions(true);
        setError(null);

        const res = await fetch("/api/cursos/search");
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error ?? "No se pudieron cargar cursos.");
        }
        const opts: Option[] = (data.items ?? []).map((it: any) => ({
          value: it.id,
          label: it.label,
        }));
        setOptions(opts);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando cursos.");
        setOptions([]);
      } finally {
        setLoadingOptions(false);
      }
    })();
  }, [open]);

  // Config de campos para EntityCreateDialog (usa "select" con options)
  const fields: ReadonlyArray<FieldConfig> = useMemo(
    () => [
      {
        name: "cursoId",
        label: "Selecciona un curso",
        type: "select",
        required: true,
        placeholder: loadingOptions
          ? "Cargando cursos…"
          : "Busca por acrónimo o nombre…",
        options,
      },
    ],
    [options, loadingOptions]
  );

  async function handleSubmit(values: FormValues) {
    // evita doble submit aunque el botón no esté deshabilitado en el dialog
    if (saving || loadingOptions) return;

    setSaving(true);
    setError(null);
    setOk(null);
    try {
      if (!values.cursoId) {
        throw new Error("Debes seleccionar un curso.");
      }

      const res = await fetch("/api/asignaturas/relacionar-curso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asignaturaId,
          cursoId: values.cursoId as string,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo relacionar el curso.");
      }

      setOk(
        data.already
          ? "Este curso ya estaba asociado."
          : "Curso asociado correctamente."
      );
      setOpen(false);
      onLinked?.();
    } catch (e: any) {
      setError(e?.message ?? "Error al asociar el curso.");
    } finally {
      setSaving(false);
    }
  }

  // ✅ Cast a any solo para permitir confirmLabel/disabled sin romper TS
  const AnyDialog =
    EntityCreateDialog as unknown as React.ComponentType<any>;

  return (
    <>
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Asociar curso
        </Button>
      </div>

      <AnyDialog
        open={open}
        onOpenChange={setOpen}
        title="Asociar curso a la asignatura"
        description="Elige un curso y crearemos la relación en la base de datos."
        fields={fields}
        confirmLabel={saving ? "Asociando…" : "Relacionar"}
        disabled={saving || loadingOptions}
        errorMessage={error ?? undefined}
        successMessage={ok ?? undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
}
