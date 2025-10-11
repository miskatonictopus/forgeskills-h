// app/asignaturas/[codigo]/page.tsx
import { AsignaturaNameHydrator } from "@/components/asignaturas/AsignaturaNameHydrator";
import { getAsignaturaByCodigoServer } from "@/data/asignaturas.server";
import { getRAyCEByAsignaturaServer } from "@/data/ra_ce.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as React from "react";

type Props = {
  // 🚨 En App Router nuevo, params es una PROMESA
  params: Promise<{ codigo: string }>;
};

export default async function Page({ params }: Props) {
  // ✅ Hay que await
  const { codigo } = await params;

  let asg: Awaited<ReturnType<typeof getAsignaturaByCodigoServer>> | null = null;
  try {
    asg = await getAsignaturaByCodigoServer(codigo);
  } catch {
    // SSR best-effort; el Hydrator completará nombre si hace falta
  }

  let raList: Awaited<ReturnType<typeof getRAyCEByAsignaturaServer>> = [];
  if (asg?.asignatura_id) {
    raList = await getRAyCEByAsignaturaServer(asg.asignatura_id);
  }
  return (
    <div
      className="p-6 md:p-8 space-y-6 rounded-xl transition-colors"
      style={{
        background: `linear-gradient(to bottom, #18181b 0%, var(--asignatura-color, ${asg?.color ?? "#8b5cf6"}) 100%)`,
      }}
    >
      <h1 className="text-4xl font-bold flex items-center gap-3 text-white">
        <span>{codigo}</span>
        {asg?.nombre ? (
          <span className="text-white/80 font-bold text-3xl">{asg.nombre}</span>
        ) : (
          <AsignaturaNameHydrator codigo={codigo} />
        )}
      </h1>

      <Card className="bg-zinc-900/60 text-white border-zinc-700">
        <CardHeader>
          <CardTitle className="text-xl">Resultados de Aprendizaje y Criterios de Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          {raList.length === 0 ? (
            <p className="text-white/70">No se encontraron RA ni CE para esta asignatura.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%] text-white/80">RA</TableHead>
                  <TableHead className="w-[45%] text-white/80">Descripción RA</TableHead>
                  <TableHead className="w-[10%] text-white/80">CE</TableHead>
                  <TableHead className="w-[35%] text-white/80">Descripción CE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {raList.map((ra) => (
                  <React.Fragment key={ra.id}>
                    {(ra.criterios_evaluacion?.length ?? 0) > 0 ? (
                      ra.criterios_evaluacion!.map((ce, idx) => (
                        <TableRow key={ce.id}>
                          {idx === 0 && (
                            <>
                              <TableCell rowSpan={ra.criterios_evaluacion!.length} className="font-bold align-top">
                                {ra.codigo}
                              </TableCell>
                              <TableCell rowSpan={ra.criterios_evaluacion!.length} className="align-top text-sm">
                                {ra.descripcion || ra.titulo}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="font-mono">{ce.codigo}</TableCell>
                          <TableCell className="text-sm">{ce.descripcion}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>{ra.codigo}</TableCell>
                        <TableCell>{ra.descripcion || ra.titulo}</TableCell>
                        <TableCell colSpan={2} className="italic text-white/60">
                          Sin criterios definidos
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
