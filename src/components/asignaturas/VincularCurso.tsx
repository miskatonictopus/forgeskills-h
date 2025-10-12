// src/components/asignaturas/VincularCurso.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Curso = {
    id: string;
    acronimo: string | null;
    nombre: string;
    nivel?: string | null;   // 👈 añade
    grado?: string | null;   // 👈 añade
  };

type Props = {
  asignaturaId: string;
  onLinked?: () => void; // para refrescar lista de la derecha
};

export function VincularCurso({ asignaturaId, onLinked }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Curso | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from("cursos")
        .select("id, acronimo, nombre, nivel, grado")
        .order("acronimo", { ascending: true });
      if (!error) setCursos((data ?? []) as Curso[]);
    }
    load();
  }, []);

  const filtered = cursos.filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (c.acronimo ?? "").toLowerCase().includes(q) || c.nombre.toLowerCase().includes(q);
  });

  async function link() {
    if (!selected) return;
    setSaving(true);
    setErr(null);
    const supabase = supabaseBrowser();

    // upsert idempotente
    const { error } = await supabase
      .from("curso_asignaturas")
      .upsert([{ curso_id: selected.id, asignatura_id: asignaturaId }], { onConflict: "curso_id,asignatura_id" });

    setSaving(false);
    if (error) {
      setErr(error.message);
    } else {
      setQuery("");
      setSelected(null);
      onLinked?.();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relacionar con un curso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Busca por acrónimo o nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="max-h-56 overflow-auto border rounded-md">
          <ul>
            {filtered.map((c) => (
              <li
                key={c.id}
                className={cn(
                  "px-3 py-2 cursor-pointer hover:bg-accent",
                  selected?.id === c.id && "bg-accent"
                )}
                onClick={() => setSelected(c)}
                title={c.nombre}
              >
                <span className="font-mono mr-2">{c.acronimo ?? "—"}{c.nivel}</span>
                <span className="text-sm text-muted-foreground">{c.nombre}</span>
              </li>
            ))}
          </ul>
        </div>

        {err && <p className="text-destructive text-sm">Error: {err}</p>}

        <Button onClick={link} disabled={!selected || saving}>
          {saving ? "Guardando…" : "Relacionar"}
        </Button>
      </CardContent>
    </Card>
  );
}
