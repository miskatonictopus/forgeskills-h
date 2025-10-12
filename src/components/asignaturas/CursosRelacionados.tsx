// src/components/asignaturas/CursosRelacionados.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Curso = {
  id: string;
  acronimo: string | null;
  nombre: string;
  nivel: string | null;
  grado: string | null;
};

type Props = {
  asignaturaId: string;
  editable?: boolean; // muestra botón para desrelacionar
  onChanged?: () => void; // callback para que el padre refresque si quiere
};

export function CursosRelacionados({ asignaturaId, editable = true, onChanged }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const supabase = supabaseBrowser();

    // 1) ids de cursos para esta asignatura
    const { data: links, error: e1 } = await supabase
      .from("curso_asignaturas")
      .select("curso_id")
      .eq("asignatura_id", asignaturaId);

    if (e1) {
      setErr(e1.message);
      setLoading(false);
      return;
    }

    const ids = (links ?? []).map((l: any) => l.curso_id).filter(Boolean);
    if (ids.length === 0) {
      setCursos([]);
      setLoading(false);
      return;
    }

    // 2) cursos
    const { data: cursosData, error: e2 } = await supabase
      .from("cursos")
      .select("id, acronimo, nombre, nivel, grado")
      .in("id", ids);

    if (e2) {
      setErr(e2.message);
      setLoading(false);
      return;
    }

    setCursos((cursosData ?? []) as Curso[]);
    setLoading(false);
  }

  useEffect(() => {
    if (asignaturaId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asignaturaId]);

  async function unlink(cursoId: string) {
    const supabase = supabaseBrowser();
    await supabase
      .from("curso_asignaturas")
      .delete()
      .eq("asignatura_id", asignaturaId)
      .eq("curso_id", cursoId);
    await load();
    onChanged?.();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cursos relacionados</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-muted-foreground text-sm">Cargando…</p>}
        {!loading && err && <p className="text-destructive text-sm">Error: {err}</p>}
        {!loading && !err && cursos.length === 0 && (
          <p className="text-muted-foreground text-sm">No hay cursos vinculados.</p>
        )}
        {!loading && !err && cursos.length > 0 && (
          <ul className="space-y-3">
            {cursos.map((curso) => (
              <li key={curso.id} className="border rounded-lg p-3 bg-card flex items-start justify-between">
                <div>
                  <div className="font-semibold">{curso.acronimo ?? "—"}</div>
                  <div className="text-sm text-muted-foreground">{curso.nombre}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {curso.nivel ?? "—"} · {curso.grado ?? "—"}
                  </div>
                </div>
                {editable && (
                  <Button variant="ghost" size="icon" onClick={() => unlink(curso.id)} title="Quitar relación">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
