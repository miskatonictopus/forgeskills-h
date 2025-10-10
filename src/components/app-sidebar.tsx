"use client";

import { SidebarCursosDynamic } from "@/components/sidebar/SidebarCursosDynamic";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus, Plus, LayoutDashboard, GraduationCap, BookUser, ChartSpline, File,
  PenLine, Flag, CalendarDays, Settings, CircleUserRound, CirclePlus,
} from "lucide-react";
import { ForgeSkillsLogo } from "@/components/ForgeSkillsLogo";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail,
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
        // Solo lista dinámica de cursos
        { customRender: () => <SidebarCursosDynamic basePath="/dashboard" /> },
      ],
    },
    {
      title: "Mis Asignaturas",
      icon: BookUser,
      url: "/dashboard/asignaturas",
      items: [
        { title: "Components", url: "#" },
        { title: "File Conventions", url: "#" },
        { title: "Functions", url: "#" },
        { title: "next.config.js Options", url: "#" },
        { title: "CLI", url: "#" },
        { title: "Edge Runtime", url: "#" },
      ],
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
      url: "/calendario",
      items: [{ title: "Vista Global", url: "/calendario" }],
    },
    {
      title: "Configuración",
      icon: Settings,
      url: "/dashboard/configuracion",
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

  const handleAction = React.useCallback(
    (sub: NavSubItem) => {
      if (sub.action === "addCourse") {
        if (onAddCourse) return onAddCourse();
        return router.push(sub.url || "/dashboard/cursos/nuevo");
      }
      if (sub.action === "addAsignatura") {
        if (onAddAsignatura) return onAddAsignatura();
        return router.push(sub.url || "/dashboard/asignaturas/nueva");
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
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 0}
                  className="group/collapsible"
                >
                  <SidebarMenuItem className="flex items-center">
                    {/* Título que NAVEGA */}
                    <SidebarMenuButton asChild className="flex-1">
                      <Link href={item.url}>
                        {item.icon ? (
                          <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        ) : null}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Toggle +/− solo si hay subitems */}
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

                  {/* Subitems */}
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

      <SidebarRail />
    </Sidebar>
  );
}
