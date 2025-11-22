// src/app/app/page.tsx
"use client";

import * as React from "react";

type Curso = {
  id: string;
  nombre: string;
  created_at: string;
};

export default function AppDashboardPage() {
  const [cursos, setCursos] = React.useState<Curso[]>([]);
  const [nombre, setNombre] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCursos = React.useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/cursos", { cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al cargar cursos");
      }
      const json = await res.json();
      setCursos(json);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar cursos");
    }
  }, []);

  React.useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al crear curso");
      }

      setNombre("");
      fetchCursos();
    } catch (e: any) {
      setError(e.message ?? "Error al crear curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Tu Panel de Control
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Aquí verás solo tus cursos (ligados a tu usuario).
      </p>

      <section className="mt-8 space-y-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Nombre del curso (p. ej. DAM1)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Añadir curso"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <div className="mt-4 space-y-2">
          {cursos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no tienes cursos creados.
            </p>
          ) : (
            <ul className="space-y-2">
              {cursos.map((curso) => (
                <li
                  key={curso.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span className="font-medium">{curso.nombre}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(curso.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
