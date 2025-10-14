"use client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { SidebarCursosDynamic } from "@/components/sidebar/SidebarCursosDynamic";
import type { PostgrestError } from "@supabase/supabase-js";
import {
  AsignaturaPickerDialog,
  type AsignaturaItem,
} from "@/components/asignaturas/AsignaturaPickerDialog";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus, Plus, LayoutDashboard, GraduationCap, BookUser, ChartSpline, File,
  PenLine, Flag, CalendarDays, Settings, CircleUserRound, CirclePlus,
  Presentation, UserRound,
} from "lucide-react";
import { ForgeSkillsLogo } from "@/components/ForgeSkillsLogo";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton,
  SidebarMenuSubItem, SidebarRail,
} from "@/components/ui/sidebar";

/* ========= Tipos ========= */
type SubAction = "addCourse" | "addAsignatura" | "addAlumno";

type NavSubItem = {
  title?: string;
  url?: string;
  isActive?: boolean;
  icon?: React.ElementType;
  isButton?: boolean;
  action?: SubAction;
  customRender?: () => React.ReactNode;
};

type NavItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
  items?: NavSubItem[];
};

// Objeto normalizado que enviamos al endpoint
type NormalizedAsignatura = {
  codigo: string;
  nombre: string;
  color?: string | null;
};

/* ========= Datos ========= */
const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard",
      items: [
        { title: "Estadísticas", url: "/dashboard", icon: ChartSpline },
        { title: "Informes", url: "/dashboard/informes", icon: File },
      ],
    },
    {
      title: "Mis Cursos",
      icon: GraduationCap,
      url: "/dashboard/cursos",
      items: [
        {
          title: "Añadir curso",
          url: "/dashboard/cursos/nuevo",
          isButton: true,
          action: "addCourse",
          icon: CirclePlus,
        },
        { customRender: () => <SidebarCursosDynamic basePath="/dashboard" /> },
      ],
    },
    {
      title: "Mis Asignaturas",
      icon: BookUser,
      url: "/asignaturas",
      items: [
        {
          title: "Añadir asignatura",
          url: "/dashboard/asignaturas/nueva",
          isButton: true,
          action: "addAsignatura",
          icon: CirclePlus,
        },
      ],
    },
    {
      title: "Mis Alumnos",
      icon: UserRound,
      url: "#",
      items: [{ title: "Contribution Guide", url: "#" }],
    },
    {
      title: "Mis Actividades",
      icon: PenLine,
      url: "/dashboard/actividades",
      items: [
        { title: "Accessibility", url: "#" },
        { title: "Fast Refresh", url: "#" },
        { title: "Next.js Compiler", url: "#" },
        { title: "Supported Browsers", url: "#" },
        { title: "Turbopack", url: "#" },
      ],
    },
    {
      title: "Mis Programaciones",
      icon: Flag,
      url: "/dashboard/programaciones",
      items: [{ title: "Contribution Guide", url: "#" }],
    },
    {
      title: "Calendario",
      icon: CalendarDays,
      url: "/dashboard/calendario",
      items: [{ title: "Vista Global", url: "/dashboard/calendario" }],
    },
    {
      title: "Presentaciones",
      icon: Presentation,
      url: "#",
      items: [{ title: "Vista Global", url: "/dashboard/calendario" }],
    },
    {
      title: "Configuración",
      icon: Settings,
      url: "/configuracion",
      items: [{ title: "Contribution Guide", url: "#" }],
    },
    {
      title: "Mi Cuenta",
      icon: CircleUserRound,
      url: "/dashboard/cuenta",
      items: [{ title: "Contribution Guide", url: "#" }],
    },
  ],
};

/* ========= Utils ========= */
function isPostgrestError(e: unknown): e is PostgrestError {
  return typeof e === "object" && e !== null && "message" in e && "code" in e;
}

/** Normaliza items del picker a {codigo, nombre, color?} (id del picker = código oficial). */
function normalizePickerItems(items: AsignaturaItem[]): NormalizedAsignatura[] {
  const map = new Map<string, AsignaturaItem>();
  for (const a of items) map.set(String(a.id), a); // dedupe por código

  return [...map.values()].map((a) => ({
    codigo: String(a.id),
    nombre: a.nombre ?? String(a.id),
    // leemos color si el picker lo trae (no hace falta tocar el tipo importado)
    color: (a as any).color ?? null,
  }));
}

/* ========= Sidebar ========= */
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onAddCourse?: () => void;
  onAddAsignatura?: () => void;
  onAddAlumno?: () => void;
};

export function AppSidebar({
  onAddCourse,
  onAddAsignatura,
  onAddAlumno,
  ...props
}: AppSidebarProps) {
  const router = useRouter();
  const [openAsignaturaPicker, setOpenAsignaturaPicker] = React.useState(false);

  /** Asegura asignaturas (y RA/CE) en BD. No asocia a cursos. */
  const ensureAsignaturasInDB = React.useCallback(async (items: AsignaturaItem[]) => {
    const supabase = supabaseBrowser();
    const normalized = normalizePickerItems(items);

    // 1) Import en server: crea/actualiza asignaturas (+ RA/CE si tu endpoint lo hace)
    try {
      const r = await fetch("/api/asignaturas/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: normalized }),
      });
      const payload = await r.json().catch(() => ({}));
      if (!r.ok || payload?.ok === false) {
        console.warn("⚠️ /api/asignaturas/import respondió error:", payload?.error ?? payload);
      } else {
        console.log(`✅ Importadas/actualizadas: ${payload?.count ?? 0}`);
      }
    } catch (e) {
      console.warn("⚠️ /api/asignaturas/import falló:", e);
    }

    // 2) (opcional) confirmar que existen en BD (puede fallar por RLS si no hay sesión)
    try {
      const codigos = normalized.map((n) => n.codigo);
      await supabase
        .from("asignaturas")
        .select("id_uuid,codigo")
        .in("codigo", codigos);
    } catch (error) {
      if (isPostgrestError(error)) {
        console.error("❌ Select asignaturas tras import:", {
          code: error.code, message: error.message, details: error.details,
        });
      }
    }
  }, []);

  // Al confirmar selección: importar y refrescar UI
  const handleAsignaturasSeleccionadas = React.useCallback(async (items: AsignaturaItem[]) => {
    await ensureAsignaturasInDB(items);
    router.refresh(); // refresca el dashboard/servidor para ver las nuevas tarjetas
    // router.push("/asignaturas"); // alternativa si quieres navegar
  }, [ensureAsignaturasInDB, router]);

  const handleAction = React.useCallback(
    (sub: NavSubItem) => {
      if (sub.action === "addCourse") {
        if (onAddCourse) return onAddCourse();
        return router.push(sub.url || "/dashboard/cursos/nuevo");
      }
      if (sub.action === "addAsignatura") {
        if (onAddAsignatura) return onAddAsignatura();
        setOpenAsignaturaPicker(true); // ← abrimos el picker
        return;
      }
      if (sub.action === "addAlumno") {
        if (onAddAlumno) return onAddAlumno();
        return router.push(sub.url || "/dashboard/alumnos/nuevo");
      }
      return router.push(sub.url || "/dashboard");
    },
    [onAddCourse, onAddAsignatura, onAddAlumno, router]
  );

  return (
    <Sidebar {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" aria-label="Inicio ForgeSkills">
                <div className="flex items-center gap-2">
                  <ForgeSkillsLogo />
                  <span className="text-sm font-medium text-muted-foreground">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>

      {/* NAVIGATION */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => {
              const hasSubitems = !!item.items?.length;
              return (
                <Collapsible key={item.title} defaultOpen={index === 0} className="group/collapsible">
                  <SidebarMenuItem className="flex items-center">
                    <SidebarMenuButton asChild className="flex-1">
                      <Link href={item.url}>
                        {item.icon ? <item.icon className="mr-2 h-4 w-4 text-muted-foreground" /> : null}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {hasSubitems && (
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Alternar ${item.title}`}
                          className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Plus className="h-4 w-4 group-data-[state=open]/collapsible:hidden" />
                          <Minus className="h-4 w-4 group-data-[state=closed]/collapsible:hidden" />
                        </button>
                      </CollapsibleTrigger>
                    )}
                  </SidebarMenuItem>

                  {hasSubitems && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items!.map((subItem, i) => {
                          if (subItem.customRender) {
                            return (
                              <SidebarMenuSubItem key={`custom-${item.title}-${i}`}>
                                {subItem.customRender()}
                              </SidebarMenuSubItem>
                            );
                          }
                          if (subItem.isButton) {
                            return (
                              <SidebarMenuSubItem key={subItem.title ?? `btn-${i}`}>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleAction(subItem)}
                                >
                                  {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                  {subItem.title}
                                </Button>
                              </SidebarMenuSubItem>
                            );
                          }
                          return (
                            <SidebarMenuSubItem key={subItem.title ?? `itm-${i}`}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url ?? "#"} className="flex items-center gap-2">
                                  {subItem.icon && (
                                    <subItem.icon className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* DIALOGO: solo Picker */}
      <AsignaturaPickerDialog
        open={openAsignaturaPicker}
        onOpenChange={setOpenAsignaturaPicker}
        onConfirm={handleAsignaturasSeleccionadas}
      />

      <SidebarRail />
    </Sidebar>
  );
}
