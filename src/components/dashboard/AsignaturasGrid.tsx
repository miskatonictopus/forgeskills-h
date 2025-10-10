// src/components/dashboard/AsignaturasGrid.tsx
"use client";

import * as React from "react";
import { listarAsignaturasDashboard, type AsignaturaDash } from "@/data/asignaturas.repo";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function AsignaturasGrid() {
  const [items, setItems] = React.useState<AsignaturaDash[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await listarAsignaturasDashboard();
        if (mounted) setItems(rows);
      } catch (e) {
        console.error("Error listando asignaturas:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
      className="
        grid gap-4
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
      "
    >
      {items.map((a) => (
        <Link key={a.id} href={`/dashboard/asignaturas/${a.id}`}>
          <Card className="h-full hover:bg-muted/40 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-4xl tracking-tight">{a.id}</CardTitle>
                {/* <Badge variant="secondary" className="shrink-0">
                  {a.cursosCount} {a.cursosCount === 1 ? "curso" : "cursos"}
                </Badge> */}
              </div>
              <CardDescription className="text-foreground line-clamp-2 text-xs font-bold">
                {a.nombre}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
