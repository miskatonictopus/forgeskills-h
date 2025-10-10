"use client";

import * as React from "react";
import Link from "next/link";
import { listarCursos, type Curso } from "@/data/cursos.repo";
import { Loader2 } from "lucide-react";

export function SidebarCursosDynamic() {
  const [cursos, setCursos] = React.useState<Curso[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarCursos();
      setCursos(data);
    } catch (err) {
      console.error("Error cargando cursos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Cargando cursos…
      </div>
    );
  }

  if (cursos.length === 0) {
    return (
      <div className="px-3 py-2 text-xs text-muted-foreground">
        No hay cursos registrados.
      </div>
    );
  }

  return (
    <ul className="space-y-1 px-2 py-1">
      {cursos.map((c) => (
        <li key={c.id}>
          <Link
            href={`/cursos/${c.id}`}
            className="block rounded-md px-3 py-2 text-xs hover:bg-muted transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">{c.acronimo}{c.nivel}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
