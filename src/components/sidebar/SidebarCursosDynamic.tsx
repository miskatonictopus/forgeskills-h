"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { listarCursos, type Curso } from "@/data/cursos.repo";
import { CalendarDays, LayoutDashboard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Prefijo de rutas protegidas. Ej: "/dashboard" */
  basePath?: string;
};

export function SidebarCursosDynamic({ basePath = "/dashboard" }: Props) {
  const pathname = usePathname();
  const [cursos, setCursos] = React.useState<Curso[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarCursos();
      setCursos(data);
    } catch (err) {
      console.error("Error cargando cursos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Cargando cursos…
      </div>
    );
  }

  // Rutas fijas
  const dashboardHref = `${basePath}`;
  const calendarioHref = `${basePath}/calendario`;

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className="px-2 py-1 space-y-3">
      {/* ==== Navegación fija ==== */}
      <ul className="space-y-1">
        <li>
          <Link
            href={dashboardHref}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
              isActive(dashboardHref) ? "bg-muted text-foreground" : "hover:bg-muted"
            )}
            aria-current={isActive(dashboardHref) ? "page" : undefined}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href={calendarioHref}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
              isActive(calendarioHref) ? "bg-muted text-foreground" : "hover:bg-muted"
            )}
            aria-current={isActive(calendarioHref) ? "page" : undefined}
          >
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">Calendario</span>
          </Link>
        </li>
      </ul>

      {/* ==== Lista de cursos ==== */}
      {cursos.length === 0 ? (
        <div className="px-1 py-2 text-xs text-muted-foreground">
          No hay cursos registrados.
        </div>
      ) : (
        <ul className="space-y-1">
          {cursos.map((c) => {
            const href = `${basePath}/cursos/${c.id}`;
            const active = isActive(href);
            return (
              <li key={c.id}>
                <Link
                  href={href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-xs transition-colors",
                    active ? "bg-muted text-foreground" : "hover:bg-muted"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {c.acronimo}
                      {c.nivel}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
