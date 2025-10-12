import { AsignaturaNameHydrator } from "@/components/asignaturas/AsignaturaNameHydrator";
import { RelacionCursosPanel } from "@/components/asignaturas/RelacionCursosPanel";
import { AsociarCursoButtonWrapper } from "@/components/asignaturas/AsociarCursoButtonWrapper"; // 👈 NUEVO
import { getAsignaturaByCodigoServer } from "@/data/asignaturas.server";
import { getRAyCEByAsignaturaServer } from "@/data/ra_ce.server";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import * as React from "react";

export const dynamic = "force-dynamic";   // 👈 evita caché de la ruta
export const revalidate = 0;              // 👈 (opcional) cero revalidación

type Props = { params: { codigo: string } };

export default async function Page({ params }: Props) {
  const { codigo } = params;

  let asg: Awaited<ReturnType<typeof getAsignaturaByCodigoServer>> | null = null;
  try { asg = await getAsignaturaByCodigoServer(codigo); } catch {}

  let raList: Awaited<ReturnType<typeof getRAyCEByAsignaturaServer>> = [];
  if (asg?.asignatura_id) {
    try { raList = await getRAyCEByAsignaturaServer(asg.asignatura_id); } catch {}
  }

  const rawDescripcion = (asg as any)?.descripcion;
  let descripcion: any = null;
  if (rawDescripcion) {
    try { descripcion = typeof rawDescripcion === "string" ? JSON.parse(rawDescripcion) : rawDescripcion; } catch {}
  }

  const duracionRaw =
    descripcion?.duracion ??
    (asg as any)?.duracion ??
    (asg as any)?.horas ??
    (asg as any)?.horas_totales ??
    null;

  const duracion =
    typeof duracionRaw === "number" ? `${duracionRaw}h` :
    typeof duracionRaw === "string" ? duracionRaw : null;

  const numRA = Array.isArray(raList) ? raList.length : 0;
  const numCE = Array.isArray(raList)
    ? raList.reduce((acc: number, ra: any) => acc + (Array.isArray(ra?.criterios_evaluacion) ? ra.criterios_evaluacion.length : 0), 0)
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
        {/* tabla */}
        <section
          className="col-span-12 rounded-xl border bg-card text-card-foreground lg:col-span-8"
          aria-labelledby="ra-ce-title"
        >
          <div className="border-b px-4 py-3">
            <h2 id="ra-ce-title" className="text-xl font-semibold">
              Resultados de Aprendizaje y Criterios de Evaluación
            </h2>
          </div>

          <div className="overflow-x-auto p-4">
            {numRA === 0 ? (
              <p className="text-muted-foreground">No se encontraron RA ni CE para esta asignatura.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[18%] text-muted-foreground">CE</TableHead>
                    <TableHead className="text-muted-foreground">Descripción CE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {raList.map((ra: any) => (
                    <React.Fragment key={ra.id ?? ra.codigo}>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableCell colSpan={2} className="py-3">
                          <div className="flex items-start gap-3">
                            <span className="whitespace-nowrap font-bold">RA {ra.codigo}</span>
                            <span className="text-sm text-muted-foreground">
                              {ra.descripcion || ra.titulo || "Sin descripción"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {Array.isArray(ra.criterios_evaluacion) && ra.criterios_evaluacion.length > 0 ? (
                        ra.criterios_evaluacion.map((ce: any) => (
                          <TableRow key={ce.id ?? ce.codigo}>
                            <TableCell className="align-top font-mono">{ce.codigo}</TableCell>
                            <TableCell className="text-sm">{ce.descripcion}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="italic text-muted-foreground">
                            Sin criterios definidos
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </section>

        {/* panel derecho */}
        <aside className="col-span-12 lg:col-span-4 space-y-3">
          {asg?.asignatura_id && (
            <>
              {/* 👉 Botón nuevo arriba (client) */}
              <AsociarCursoButtonWrapper asignaturaId={asg.asignatura_id} />

              {/* 👉 Panel con la lista (server) */}
              <RelacionCursosPanel asignaturaId={asg.asignatura_id} />
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
