// components/sidebar/SidebarCursosDynamic.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { listarCursos, type Curso } from "@/data/cursos.repo";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  basePath?: string;       // ej: "/dashboard"
  showFixed?: boolean;     // 👈 añade esta prop
};

export function SidebarCursosDynamic({ basePath = "/dashboard", showFixed = false }: Props) {
  const pathname = usePathname();
  const [cursos, setCursos] = React.useState<Curso[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try { setCursos(await listarCursos()); } 
    catch (e) { console.error(e); } 
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { void refetch(); }, [refetch]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Cargando cursos…
      </div>
    );
  }

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className="px-1 space-y-2">
      {/* 👇 Solo si explícitamente quieres ver los links fijos aquí */}
      {showFixed && (
        <ul className="space-y-1">
          <li>
            <Link
              href={`${basePath}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                isActive(`${basePath}`) ? "bg-muted text-foreground" : "hover:bg-muted"
              )}
            >
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href={`${basePath}/calendario`}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                isActive(`${basePath}/calendario`) ? "bg-muted text-foreground" : "hover:bg-muted"
              )}
            >
              <span className="font-medium">Calendario</span>
            </Link>
          </li>
        </ul>
      )}

      {/* Lista de cursos */}
      {cursos.length === 0 ? (
        <div className="px-2 py-2 text-xs text-muted-foreground">No hay cursos registrados.</div>
      ) : (
        <ul className="space-y-1">
          {cursos.map((c) => {
            const href = `${basePath}/cursos/${c.id}`;
            return (
              <li key={c.id}>
                <Link
                  href={href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-xs transition-colors",
                    isActive(href) ? "bg-muted text-foreground" : "hover:bg-muted"
                  )}
                >
                  <span className="font-medium text-foreground">{c.acronimo}{c.nivel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
