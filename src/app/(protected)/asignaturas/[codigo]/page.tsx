import { AsignaturaNameHydrator } from "@/components/asignaturas/AsignaturaNameHydrator";
import { AsociarCursoButtonWrapper } from "@/components/asignaturas/AsociarCursoButtonWrapper";
import { RAyCEConCursosTable } from "@/components/asignaturas/RAyCEConCursosTable";
import { getCursosRelacionados } from "@/data/cursos_relacionados.server";
import { getAsignaturaByCodigoServer } from "@/data/asignaturas.server";
import { getRAyCEByAsignaturaServer } from "@/data/ra_ce.server";
import * as React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: { codigo: string } };

export default async function Page({ params }: Props) {
  const { codigo } = params;

  // --- Carga asignatura ---
  let asg: Awaited<ReturnType<typeof getAsignaturaByCodigoServer>> | null = null;
  try {
    asg = await getAsignaturaByCodigoServer(codigo);
  } catch {}

  // --- Carga RA/CE ---
  let raList: Awaited<ReturnType<typeof getRAyCEByAsignaturaServer>> = [];
  if (asg?.asignatura_id) {
    try {
      raList = await getRAyCEByAsignaturaServer(asg.asignatura_id);
    } catch {}
  }

  // --- Carga cursos relacionados (columnas) ---
  const cursos = asg?.asignatura_id
    ? await getCursosRelacionados(asg.asignatura_id)
    : [];

  // --- Métricas header ---
  const rawDescripcion = (asg as any)?.descripcion;
  let descripcion: any = null;
  if (rawDescripcion) {
    try {
      descripcion =
        typeof rawDescripcion === "string"
          ? JSON.parse(rawDescripcion)
          : rawDescripcion;
    } catch {}
  }

  const duracionRaw =
    descripcion?.duracion ??
    (asg as any)?.duracion ??
    (asg as any)?.horas ??
    (asg as any)?.horas_totales ??
    null;

  const duracion =
    typeof duracionRaw === "number"
      ? `${duracionRaw}h`
      : typeof duracionRaw === "string"
      ? duracionRaw
      : null;

  const numRA = Array.isArray(raList) ? raList.length : 0;
  const numCE = Array.isArray(raList)
    ? raList.reduce(
        (acc: number, ra: any) =>
          acc +
          (Array.isArray(ra?.criterios_evaluacion)
            ? ra.criterios_evaluacion.length
            : 0),
        0
      )
    : 0;

  return (
    <main className="p-4">
      {/* cabecera */}
      <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold text-foreground">
        <span>{codigo}</span>
        {asg?.nombre ? (
          <span className="text-3xl font-bold text-foreground">{asg.nombre}</span>
        ) : (
          <AsignaturaNameHydrator codigo={codigo} />
        )}
      </h1>

      {/* métricas */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {duracion && (
          <span className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1">
            <span className="text-xs text-foreground">Duración</span>
            <span className="text-2xl font-bold text-foreground">{duracion}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1">
          <span className="text-xs text-foreground">RA</span>
          <span className="text-2xl font-bold text-foreground">{numRA}</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1">
          <span className="text-xs text-foreground">CE</span>
          <span className="text-2xl font-bold text-foreground">{numCE}</span>
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tabla RA/CE con columnas de cursos */}
        <section
          className="col-span-12 rounded-xl border bg-card text-card-foreground lg:col-span-9"
          aria-labelledby="ra-ce-title"
        >
          <div className="border-b px-4 py-3">
            <h2 id="ra-ce-title" className="text-xl font-semibold">
              Resultados de Aprendizaje y Criterios de Evaluación
            </h2>
          </div>

          <div className="p-4">
            {numRA === 0 ? (
              <p className="text-muted-foreground">
                No se encontraron RA ni CE para esta asignatura.
              </p>
            ) : (
              <RAyCEConCursosTable raList={raList as any} cursos={cursos as any} />
            )}
          </div>
        </section>

        {/* Lateral: acciones */}
        <aside className="col-span-12 space-y-3 lg:col-span-3">
          {asg?.asignatura_id && (
            <AsociarCursoButtonWrapper asignaturaId={asg.asignatura_id} />
          )}
        </aside>
      </div>
    </main>
  );
}
