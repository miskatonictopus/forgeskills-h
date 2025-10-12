// app/asignaturas/[codigo]/page.tsx
import { AsignaturaNameHydrator } from "@/components/asignaturas/AsignaturaNameHydrator";
import { getAsignaturaByCodigoServer } from "@/data/asignaturas.server";
import { getRAyCEByAsignaturaServer } from "@/data/ra_ce.server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as React from "react";

type Props = {
  params: Promise<{ codigo: string }>;
};

export default async function Page({ params }: Props) {
  const { codigo } = await params;

  let asg: Awaited<ReturnType<typeof getAsignaturaByCodigoServer>> | null = null;
  try {
    asg = await getAsignaturaByCodigoServer(codigo);
  } catch {}

  let raList: Awaited<ReturnType<typeof getRAyCEByAsignaturaServer>> = [];
  if (asg?.asignatura_id) {
    raList = await getRAyCEByAsignaturaServer(asg.asignatura_id);
  }

  return (
    <main className="p-4">
      {/* cabecera */}
      <h1 className="text-4xl font-bold flex items-center gap-3 text-foreground mb-6">
        <span>{codigo}</span>
        {asg?.nombre ? (
          <span className="text-foreground font-bold text-3xl">{asg.nombre}</span>
        ) : (
          <AsignaturaNameHydrator codigo={codigo} />
        )}
      </h1>

      {/* layout 12 cols; la tabla ocupa 8 */}
      <div className="grid grid-cols-12 gap-6">
        <section
          className="col-span-12 lg:col-span-8 rounded-xl border bg-card text-card-foreground"
          aria-labelledby="ra-ce-title"
        >
          <div className="px-4 py-3 border-b">
            <h2 id="ra-ce-title" className="text-xl font-semibold">
              Resultados de Aprendizaje y Criterios de Evaluación
            </h2>
          </div>

          <div className="p-4 overflow-x-auto">
            {raList.length === 0 ? (
              <p className="text-muted-foreground">No se encontraron RA ni CE para esta asignatura.</p>
            ) : (
              <Table>
                {/* Cabecera solo para los CE (el RA va en una fila completa encima) */}
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[18%] text-muted-foreground">CE</TableHead>
                    <TableHead className="text-muted-foreground">Descripción CE</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {raList.map((ra) => (
                    <React.Fragment key={ra.id}>
                      {/* Fila cabecera del RA ocupando toda la anchura */}
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableCell colSpan={2} className="py-3">
                          <div className="flex gap-3 items-start">
                            <span className="font-bold whitespace-nowrap">RA {ra.codigo}</span>
                            <span className="text-sm text-muted-foreground">
                              {ra.descripcion || ra.titulo}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* CE del RA */}
                      {(ra.criterios_evaluacion?.length ?? 0) > 0 ? (
                        ra.criterios_evaluacion!.map((ce) => (
                          <TableRow key={ce.id}>
                            <TableCell className="font-mono align-top">{ce.codigo}</TableCell>
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

        {/* espacio 4 columnas para futuros widgets */}
        <aside className="col-span-12 lg:col-span-4 space-y-4" />
      </div>
    </main>
  );
}
