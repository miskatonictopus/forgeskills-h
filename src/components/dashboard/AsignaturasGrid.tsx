"use client";

import * as React from "react";
import {
  listarAsignaturasDashboard,
  actualizarColorAsignatura,
  type AsignaturaDash,
} from "@/data/asignaturas.repo";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Palette } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PALETTE = [
  "#fca5a5", "#f87171", "#ef4444", "#b91c1c", "#7f1d1d",
  "#7dd3fc", "#0ea5e9", "#0369a1", "#0c4a6e", "#082f49",
  "#fef08a", "#fde047", "#eab308", "#a16207", "#713f12",
  "#99f6e4", "#5eead4", "#14b8a6", "#0f766e", "#134e4a",
];

export function AsignaturasGrid() {
  const [items, setItems] = React.useState<AsignaturaDash[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [savingId, setSavingId] = React.useState<string | null>(null);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listarAsignaturasDashboard();
      setItems(rows);
    } catch (e) {
      console.error("Error listando asignaturas:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refetch();
  }, [refetch]);

  const onPickColor = async (asg: AsignaturaDash, color: string) => {
    try {
      setSavingId(asg.id);
      await actualizarColorAsignatura(asg.id, color);
      // actualiza en memoria sin reconsultar
      setItems((prev) =>
        prev.map((x) => (x.id === asg.id ? { ...x, color } : x))
      );
    } catch (e) {
      console.error("Error actualizando color:", e);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-1 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando asignaturas…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-1 py-2">
        Aún no hay asignaturas asociadas.
      </p>
    );
  }

  return (
    <div
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {items.map((a) => (
        <Card
        key={a.id}
        className={cn(
          "relative h-full transition-colors text-white shadow-sm border-0",
          "hover:opacity-90"
        )}
        style={{
          background: `linear-gradient(to bottom, #18181b 0%, ${a.color ?? "#8b5cf6"} 100%)`,
        }}
      >
          {/* Botón/picker color arriba derecha */}
          <div className="absolute right-2 top-2 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs",
                    "bg-background/60 backdrop-blur hover:bg-background"
                  )}
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full border"
                    style={{ backgroundColor: a.color ?? "#8b5cf6" }}
                    aria-hidden
                  />
                  <Palette className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[220px] p-3"
              >
                <div className="grid grid-cols-5 gap-2">
                  {PALETTE.map((hex) => {
                    const active = (a.color ?? "").toLowerCase() === hex.toLowerCase();
                    return (
                      <button
                        key={hex}
                        aria-label={`Elegir color ${hex}`}
                        className={cn(
                          "h-8 w-8 rounded-full border",
                          active && "ring-2 ring-offset-2 ring-primary"
                        )}
                        style={{ backgroundColor: hex }}
                        onClick={() => onPickColor(a, hex)}
                        disabled={savingId === a.id}
                        title={hex}
                      />
                    );
                  })}
                </div>
                {savingId === a.id && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Guardando color…
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <Link href={`/dashboard/asignaturas/${a.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-4xl tracking-tight font-bold">{a.id}</CardTitle>
                {/* <Badge variant="secondary" className="shrink-0">
                  {a.cursosCount} {a.cursosCount === 1 ? "curso" : "cursos"}
                </Badge> */}
              </div>
              <CardDescription className="line-clamp-2 text-foreground text-xs font-bold">
                {a.nombre}
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      ))}
    </div>
  );
}
