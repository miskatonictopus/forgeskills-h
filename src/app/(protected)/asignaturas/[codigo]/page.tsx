// app/(protected)/asignaturas/[codigo]/page.tsx
import { AsignaturaNameHydrator } from "@/components/asignaturas/AsignaturaNameHydrator";
import { AsociarCursoButtonWrapper } from "@/components/asignaturas/AsociarCursoButtonWrapper";
import { RAyCEConCursosTable } from "@/components/asignaturas/RAyCEConCursosTable";
import { getCursosRelacionados } from "@/data/cursos_relacionados.server";
import { getAsignaturaByCodigoServer } from "@/data/asignaturas.server";
import { getRAyCEByAsignaturaServer } from "@/data/ra_ce.server";
import {
  type RAConCE,
  type CursoResumen,
  type AsignaturaSSR,
} from "@/types/asignaturas";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type Params = { codigo: string };

// Forma compatible con Next 15 (params puede venir como Promise)
export default async function Page({ params }: { params: Promise<Params> }) {
  const { codigo } = await params;

  // 1) Asignatura
  const asg: AsignaturaSSR | null = await getAsignaturaByCodigoServer(codigo);

  // 2) RA/CE + Cursos (adaptamos el shape para la tabla)
  let raList: RAConCE[] = [];
  let cursosForTable: {
    id: string;
    acronimo: string;
    nombre: string;
    nivel?: string | number | null;
    grado?: string | null;
  }[] = [];

  if (asg?.asignatura_id) {
    raList = await getRAyCEByAsignaturaServer(asg.asignatura_id);
    const cursosRaw: CursoResumen[] = await getCursosRelacionados(asg.asignatura_id);
  
    // 👇 Adaptamos el tipo exactamente al que usa RAyCEConCursosTable
    cursosForTable = (cursosRaw ?? []).map((c) => ({
      id: c.id,
      acronimo: String(c.acronimo ?? "").trim(),
      nombre: c.nombre,
      nivel: c.nivel !== undefined && c.nivel !== null ? String(c.nivel) : null, // 💥 tipado limpio
      grado: c.grado ?? null,
    })) satisfies {
      id: string;
      acronimo: string;
      nombre: string;
      nivel?: string | number | null;
      grado?: string | null;
    }[];
  }

  // 3) Descripción / duración
  const rawDescripcion = asg?.descripcion;
  let descripcion: unknown = undefined;
  if (rawDescripcion) {
    if (typeof rawDescripcion === "string") {
      try {
        descripcion = JSON.parse(rawDescripcion);
      } catch {
        descripcion = rawDescripcion;
      }
    } else {
      descripcion = rawDescripcion;
    }
  }

  const d = descripcion as Record<string, unknown> | undefined;
  const duracionRaw =
    (d?.duracion as string | number | undefined) ??
    (asg?.duracion as string | number | null) ??
    (asg?.horas as number | null) ??
    (asg?.horas_totales as number | null) ??
    null;

  const duracion =
    typeof duracionRaw === "number"
      ? `${duracionRaw}h`
      : typeof duracionRaw === "string"
      ? duracionRaw
      : null;

  // 4) Métricas
  const numRA = raList.length;
  const numCE = raList.reduce(
    (acc, ra) => acc + (ra.criterios_evaluacion?.length ?? 0),
    0
  );

  // 5) UI
  return (
    <main className="p-4">
      {/* cabecera */}
      <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold text-foreground">
        <span>{codigo}</span>
        {asg?.nombre ? (
          <span className="text-3xl font-bold text-foreground">
            {asg.nombre}
          </span>
        ) : (
          <AsignaturaNameHydrator codigo={codigo} />
        )}
      </h1>

      {/* métricas */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {duracion && (
          <span className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1">
            <span className="text-xs text-foreground">Duración</span>
            <span className="text-2xl font-bold text-foreground">
              {duracion}
            </span>
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
              <RAyCEConCursosTable raList={raList} cursos={cursosForTable} />
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
