import { listarCursosServer, type Curso } from "@/data/cursos.repo";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AsignaturasGridServer from "@/components/dashboard/AsignaturasGridServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs"; // 👈 para evitar edge con service role

export default async function DashboardPage() {
  let cursos: Curso[] = [];
  try {
    cursos = await listarCursosServer();
  } catch {
    cursos = [];
  }

  return (
    <main className="p-1 md:p-2 lg:p-4 xl:p-6 space-y-10 max-w-none">
      <section className="space-y-4">
        {cursos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay cursos en la base de datos.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {cursos.map((c) => (
              <Card key={c.id} className="transition-colors hover:border-primary/50 shadow-sm bg-neutral-100 dark:bg-zinc-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold tracking-tight">
                    {c.acronimo}{c.nivel}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs leading-snug line-clamp-2 text-foreground">{c.nombre}</p>
                  <p className="text-xs text-muted-foreground uppercase">{c.grado}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
      <AsignaturasGridServer />
      </section>
    </main>
  );
}
