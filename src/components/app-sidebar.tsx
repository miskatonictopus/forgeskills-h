"use client";

import { SidebarCursosDynamic } from "@/components/sidebar/SidebarCursosDynamic";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  LayoutDashboard,
  GraduationCap,
  BookUser,
  ChartSpline,
  File,
  PenLine,
  Flag,
  CalendarDays,
  Settings,
  CircleUserRound,
  CirclePlus,
} from "lucide-react";
import { ForgeSkillsLogo } from "@/components/ForgeSkillsLogo";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
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
  /** Render personalizado (ej. lista dinámica de cursos) */
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
        { title: "Estadísticas", url: "/dashboard", isActive: false, icon: ChartSpline },
        { title: "Informes", url: "/dashboard/informes", isActive: false, icon: File },
      ],
    },
    {
      title: "Mis Cursos",
      icon: GraduationCap,
      url: "/cursos",
      items: [
        {
          title: "Añadir curso",
          url: "/cursos/nuevo",
          isButton: true,
          action: "addCourse",
          icon: CirclePlus,
        },
        // 👇 lista dinámica de cursos (en tiempo real)
        {
          customRender: () => <SidebarCursosDynamic />,
        },
      ],
    },
    {
      title: "Mis Asignaturas",
      icon: BookUser,
      url: "/asignaturas",
      items: [
        // {
        //   title: "Añadir asignatura",
        //   url: "/asignaturas/nueva",
        //   isButton: true,
        //   action: "addAsignatura",
        //   icon: CirclePlus,
        // },
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
      url: "/actividades",
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
      url: "/programaciones",
      items: [{ title: "Contribution Guide", url: "#" }],
    },
    {
      title: "Calendario",
      icon: CalendarDays,
      url: "/calendario",
      items: [{ title: "Contribution Guide", url: "#" }],
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
      url: "/cuenta",
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
        return router.push(sub.url || "/cursos/nuevo");
      }
      if (sub.action === "addAsignatura") {
        if (onAddAsignatura) return onAddAsignatura();
        return router.push(sub.url || "/asignaturas/nueva");
      }
      if (sub.action === "addAlumno") {
        if (onAddAlumno) return onAddAlumno();
        return router.push(sub.url || "/alumnos/nuevo");
      }
      return router.push(sub.url || "/");
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
            {data.navMain.map((item, index) => (
              <Collapsible key={item.title} defaultOpen={index === 0} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.icon ? <item.icon className="mr-2 h-4 w-4 text-muted-foreground" /> : null}
                      <span>{item.title}</span>
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem, i) => {
                          // 🔹 Render personalizado (lista dinámica)
                          if (subItem.customRender) {
                            return (
                              <SidebarMenuSubItem key={`custom-${item.title}-${i}`}>
                                {subItem.customRender()}
                              </SidebarMenuSubItem>
                            );
                          }

                          // 🔹 Botón de acción (Añadir curso, etc.)
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

                          // 🔹 Enlace normal
                          return (
                            <SidebarMenuSubItem key={subItem.title ?? `itm-${i}`}>
                              <SidebarMenuSubButton asChild isActive={!!subItem.isActive}>
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
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
