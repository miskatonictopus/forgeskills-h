"use client";
import * as React from "react";

type AsignaturaSSR = {
  asignatura_id: string;
  codigo: string | null;
  nombre: string;
  color?: string | null;
};

export function AsignaturaNameHydrator({ codigo }: { codigo: string }) {
  const [asg, setAsg] = React.useState<AsignaturaSSR | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/asignaturas/by-codigo?codigo=${encodeURIComponent(codigo)}`, { cache: "no-store" });
        let json: any = null;
        try { json = await res.json(); } catch {}
        if (active) setAsg(json?.data ?? null);
        if (!res.ok) console.warn("by-codigo status:", res.status, json?.error);
      } catch (e) {
        console.error("Hydrator fetch error:", e);
        if (active) setAsg(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [codigo]);

  React.useEffect(() => {
    if (asg?.color) document.documentElement.style.setProperty("--asignatura-color", asg.color);
  }, [asg?.color]);

  if (loading) return <span className="text-white/70 text-3xl font-semibold">Cargando…</span>;
  return <span className="text-white/90 text-3xl font-semibold">{asg?.nombre ?? "Desconocida"}</span>;
}
