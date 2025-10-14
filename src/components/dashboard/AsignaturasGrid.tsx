"use client";

import Link from "next/link";
import { type AsignaturaDash } from "@/data/asignaturas.repo";

type Props = { data: AsignaturaDash[] };

export default function AsignaturasGridClient({ data }: Props) {
  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No hay asignaturas en la base de datos.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {data.map((a) => (
        <Link
          key={a.id}
          href={`/asignaturas/${encodeURIComponent(a.codigo)}`}
          className="rounded-xl border bg-card p-5 hover:border-primary/50 shadow-sm"
          style={a.color ? { background: a.color } : undefined}
        >
          <div className="text-4xl font-bold tracking-tight">{a.codigo}</div>
          <div className="mt-1 text-xs leading-snug text-foreground">{a.nombre}</div>
        </Link>
      ))}
    </div>
  );
}
