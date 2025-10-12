// components/asignaturas/RAyCEConCursosTable.tsx
import * as React from "react";

type Curso = {
  id: string;
  acronimo: string;
  nombre: string;
  nivel?: string | number | null;
  grado?: string | null;
};

type CE = {
  id: string;
  codigo: string;
  descripcion: string;
};

type RA = {
  id: string;
  codigo: string | number;
  descripcion?: string | null;
  titulo?: string | null;
  criterios_evaluacion?: CE[];
};

type Estado = "done" | "partial" | "pending";

type Props = {
  raList: RA[];
  cursos: Curso[];
  /** Estado por CE y curso: { [ceId]: { [cursoId]: "done"|"partial"|"pending" } } */
  ceStates?: Record<string, Record<string, Estado>>;
  /** (Opcional) Estado por RA y curso; si no se pasa, se calcula a partir de CE */
  raStates?: Record<string, Record<string, Estado>>;
};

function Pill({ state }: { state: Estado }) {
  const label = state === "done" ? "✓" : state === "partial" ? "…" : "";
  const title =
    state === "done"
      ? "Completado"
      : state === "partial"
      ? "En progreso"
      : "Pendiente";
  const bg =
    state === "done"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      : state === "partial"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
      : "bg-muted/30 text-muted-foreground border-muted";
  return (
    <span
      title={title}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm ${bg}`}
    >
      {label}
    </span>
  );
}

function aggregateEstado(ceEstados: Estado[]): Estado {
  if (ceEstados.length === 0) return "pending";
  const allDone = ceEstados.every((s) => s === "done");
  if (allDone) return "done";
  const anyDoneOrPartial = ceEstados.some((s) => s !== "pending");
  return anyDoneOrPartial ? "partial" : "pending";
}

export function RAyCEConCursosTable({
  raList,
  cursos,
  ceStates = {},
  raStates = {},
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="text-left text-sm text-muted-foreground">
          <tr>
            <th className="w-[18%] border-b px-4 py-3 font-medium">CE</th>
            <th className="border-b px-4 py-3 font-medium">Descripción CE</th>
            {cursos.map((c) => (
  <th key={c.id} className="border-b px-2 py-3 font-medium text-right">
    <div className="flex items-center justify-end">
      <span
        className="text-2xl font-bold text-foreground"
        title={`${c.nombre} — ${c.grado ?? ""}`}
      >
        {/* acrónimo + nivel sin espacio */}
        {c.acronimo}
        {c.nivel && (
          <span className="text-2xl font-bold text-foreground">{c.nivel}</span>
        )}
      </span>
    </div>
  </th>
))}
          </tr>
        </thead>

        <tbody className="text-sm">
          {raList.map((ra) => {
            // 🔸 Estados agregados por RA y curso (si no vienen forzados)
            const aggregatedPerCurso: Record<string, Estado> = {};
            for (const curso of cursos) {
              if (raStates[ra.id]?.[curso.id]) {
                aggregatedPerCurso[curso.id] = raStates[ra.id][curso.id]; // override manual
              } else {
                const estadosCE: Estado[] = (ra.criterios_evaluacion ?? []).map(
                  (ce) => ceStates[ce.id]?.[curso.id] ?? "pending"
                );
                aggregatedPerCurso[curso.id] = aggregateEstado(estadosCE);
              }
            }

            return (
              <React.Fragment key={ra.id ?? ra.codigo}>
                {/* Fila RA con pills por curso */}
                <tr className="bg-muted/30">
                  <td className="px-4 py-3 font-bold whitespace-nowrap">
                    RA {ra.codigo}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {ra.descripcion || ra.titulo || "Sin descripción"}
                  </td>
                  {cursos.map((c) => (
                    <td key={c.id} className="px-2 py-2 text-right">
                      <Pill state={aggregatedPerCurso[c.id]} />
                    </td>
                  ))}
                </tr>

                {/* Filas CE del RA */}
                {Array.isArray(ra.criterios_evaluacion) &&
                ra.criterios_evaluacion.length > 0 ? (
                  ra.criterios_evaluacion.map((ce) => (
                    <tr
                      key={ce.id ?? ce.codigo}
                      className="border-b border-border/50"
                    >
                      <td className="px-4 py-3 font-mono align-top">
                        {ce.codigo}
                      </td>
                      <td className="px-4 py-3 align-top">{ce.descripcion}</td>
                      {cursos.map((c) => {
                        const state = ceStates[ce.id]?.[c.id] ?? "pending";
                        return (
                          <td
                            key={c.id}
                            className="px-2 py-2 align-top text-right"
                          >
                            <Pill state={state} />
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2 + cursos.length}
                      className="px-4 py-3 italic text-muted-foreground"
                    >
                      Sin criterios definidos
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
