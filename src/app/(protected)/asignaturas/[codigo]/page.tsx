// Server Component (no "use client")
import { AsignaturaNameHydrator } from "@/components/asignaturas/AsignaturaNameHydrator";
import { getAsignaturaByCodigoServer } from "@/data/asignaturas.server";

type Props = { params: { codigo: string } };

export default async function Page({ params }: Props) {
  const codigo = params.codigo;

  // Intento SSR. Si falla o no hay datos, seguimos sin 404 y dejará al hidrator completar el nombre.
  let asg: Awaited<ReturnType<typeof getAsignaturaByCodigoServer>> | null = null;
  try {
    asg = await getAsignaturaByCodigoServer(codigo);
  } catch {
    // silencioso: puede ser RLS/tabla distinta; lo resuelve el hidrator
  }
  return (
    <div
    className="p-6 md:p-8 space-y-4 rounded-xl transition-colors"
    style={{
      background: `linear-gradient(to bottom, #18181b 0%, var(--asignatura-color, ${asg?.color ?? "#8b5cf6"}) 100%)`,
    }}
  >
      <h1 className="text-4xl font-bold flex items-center gap-3 text-white">
        <span>{codigo}</span>

        {/* Si SSR trajo nombre, úsalo; si no, hidrator cliente */}
        {asg?.nombre ? (
          <span className="text-white/80 font-semibold text-3xl">{asg.nombre}</span>
        ) : (
          <AsignaturaNameHydrator codigo={codigo} />
        )}
      </h1>

      <p className="text-white/80">
        Aquí irá la información detallada de la asignatura <b>{codigo}</b>.
      </p>
    </div>
  );
}
