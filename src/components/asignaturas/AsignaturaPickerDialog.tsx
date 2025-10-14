"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

// ==== Tipos y helpers ==== //
type AsignaturaJson = Record<string, unknown>;

export type AsignaturaItem = {
  id: string;
  nombre: string;
  color?: string | null;
  raw?: AsignaturaJson;
};

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function colorOf(v: unknown): string | undefined {
  if (!v) return undefined;
  const s = String(v).trim();
  return s ? s : undefined;
}

/** Extrae id/nombre y color de forma tolerante a distintos esquemas */
function mapAsignatura(a: AsignaturaJson): AsignaturaItem | null {
  const id =
    str(a.id) ?? str(a.codigo) ?? str(a.code) ?? str(a.clave) ?? str(a.cod);
  const nombre =
    str(a.nombre) ?? str(a.name) ?? str(a.titulo) ?? str(a.title);
  if (!id || !nombre) return null;

  const color =
    colorOf((a as any).color) ??
    colorOf((a as any).hex) ??
    colorOf((a as any).bgColor);

  return { id, nombre, color: color ?? null, raw: a };
}

// ==== Props del diálogo ==== //
type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (seleccionadas: AsignaturaItem[]) => void;
  sourceUrl?: string; // URL del JSON remoto
};

// ==== Componente principal ==== //
export function AsignaturaPickerDialog({
  open,
  onOpenChange,
  onConfirm,
  sourceUrl = "https://raw.githubusercontent.com/miskatonictopus/asignaturas_fp/refs/heads/main/asignaturas_FP.json",
}: Props) {
  const [data, setData] = React.useState<AsignaturaItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(sourceUrl)
      .then((r) => r.json())
      .then((json: unknown) => {
        const itemsUnknown: unknown[] = Array.isArray(json)
          ? (json as unknown[])
          : Object.values((json ?? {}) as Record<string, unknown>);

        const arr: AsignaturaItem[] = itemsUnknown
          .map((v) => mapAsignatura((v ?? {}) as AsignaturaJson))
          .filter((x): x is AsignaturaItem => Boolean(x));

        setData(arr);
      })
      .catch((e) => console.error("Error cargando asignaturas JSON:", e))
      .finally(() => setLoading(false));
  }, [open, sourceUrl]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(
      (a) =>
        a.id.toLowerCase().includes(s) ||
        a.nombre.toLowerCase().includes(s)
    );
  }, [q, data]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const confirm = () => {
    const seleccionadas = data.filter((a) => checked[a.id]);
    onConfirm(seleccionadas);
    onOpenChange(false);
    setChecked({});
    setQ("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Añadir asignaturas</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Buscar por id o nombre…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="rounded-md border">
            {loading ? (
              <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando asignaturas…
              </div>
            ) : (
              <ScrollArea className="h-72">
                <ul className="divide-y">
                  {filtered.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 px-3 py-2">
                      <Checkbox
                        checked={!!checked[a.id]}
                        onCheckedChange={() => toggle(a.id)}
                        id={`asg-${a.id}`}
                      />
                      <label htmlFor={`asg-${a.id}`} className="cursor-pointer">
                        <div className="text-sm font-medium">{a.id}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.nombre}
                        </div>
                      </label>
                    </li>
                  ))}
                  {filtered.length === 0 && (
                    <li className="px-3 py-6 text-sm text-muted-foreground">
                      No hay resultados para “{q}”.
                    </li>
                  )}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={confirm} disabled={loading}>
            Añadir seleccionadas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export por defecto opcional (para compatibilidad)
export default AsignaturaPickerDialog;
