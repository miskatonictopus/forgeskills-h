"use client";

import * as React from "react";
import Link from "next/link";
import { listarCursos, type Curso } from "@/data/cursos.repo";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function SidebarCourses() {
  const [items, setItems] = React.useState<Curso[]>([]);

  const fetchData = React.useCallback(async () => {
    const rows = await listarCursos(); // usa el repo del browser
    setItems(rows);
  }, []);

  React.useEffect(() => {
    void fetchData();

    // 🔄 Realtime: refresca la lista al insertar/actualizar/borrar
    const sb = supabaseBrowser();
    const ch = sb
      .channel("cursos-sidebar")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cursos" },
        () => { void fetchData(); }
      )
      .subscribe();

    return () => { sb.removeChannel(ch); };
  }, [fetchData]);

  if (items.length === 0) return null;

  return (
    <ul className="mt-1 space-y-1">
      {items.map((c) => (
        <li key={c.id}>
          <Link
            // Ajusta la ruta a la que quieras navegar (detalle/listado)
            href={`/cursos/${encodeURIComponent(c.id)}`}
            className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
          >
            <span className="truncate">{c.acronimo}</span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {c.grado}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
