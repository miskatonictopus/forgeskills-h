"use client";

import * as React from "react";
import { listarAsignaturasDashboard, type AsignaturaDash } from "@/data/asignaturas.repo";

export function AsignaturaNameHydrator({ codigo }: { codigo: string }) {
  const [asg, setAsg] = React.useState<AsignaturaDash | null>(null);

  // ✅ Efecto 1: obtener datos
  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const rows = await listarAsignaturasDashboard();
        const found = rows.find((a) => a.id === codigo) ?? null;
        if (alive) setAsg(found);
      } catch (e) {
        console.error("Hydrator error", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [codigo]);

  // ✅ Efecto 2: aplicar color de fondo
  React.useEffect(() => {
    if (asg?.color) {
      document.documentElement.style.setProperty("--asignatura-color", asg.color);
    }
  }, [asg?.color]);

  // ✅ Render siempre devuelve lo mismo (sin condicionales de hooks)
  return (
    <span className="text-white/80 text-3xl font-semibold">
      {asg?.nombre ?? "Cargando…"}
    </span>
  );
}

