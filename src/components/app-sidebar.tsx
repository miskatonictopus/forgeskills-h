import * as React from "react";
import { Minus, Plus, LayoutDashboard, GraduationCap, BookUser, ChartSpline, File } from "lucide-react";
import { ForgeSkillsLogo } from "@/components/ForgeSkillsLogo";
import { SearchForm } from "@/components/search-form";
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

// ✅ Tipos de datos
type NavSubItem = {
  title: string;
  url: string;
  isActive?: boolean;
  icon?: React.ElementType; // 👈 añade esta línea
};

type NavItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
  items?: NavSubItem[];
};

// ✅ Datos con tipado correcto
const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "#",
      items: [
        {
          title: "Estadísticas",
          url: "/dashboard",
          isActive: false,
          icon: ChartSpline, // 👈 icono delante del título “Estadísticas”
        },
        {
          title: "Informes",
          url: "/dashboard",
          isActive: false,
          icon: File, // 👈 icono delante del título “Estadísticas”
        },
      ],
    },
    {
      title: "Mis Cursos",
      icon: GraduationCap,
      url: "#",
      items: [
        { title: "Routing", url: "#" },
        { title: "Data Fetching", url: "#", isActive: true },
        { title: "Rendering", url: "#" },
        { title: "Caching", url: "#" },
        { title: "Styling", url: "#" },
        { title: "Optimizing", url: "#" },
        { title: "Configuring", url: "#" },
        { title: "Testing", url: "#" },
        { title: "Authentication", url: "#" },
        { title: "Deploying", url: "#" },
        { title: "Upgrading", url: "#" },
        { title: "Examples", url: "#" },
      ],
    },
    {
      title: "Mis Asignaturas",
      icon: BookUser,
      url: "#",
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
      title: "Architecture",
      url: "#",
      items: [
        { title: "Accessibility", url: "#" },
        { title: "Fast Refresh", url: "#" },
        { title: "Next.js Compiler", url: "#" },
        { title: "Supported Browsers", url: "#" },
        { title: "Turbopack", url: "#" },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [{ title: "Contribution Guide", url: "#" }],
    },
  ],
};

// ✅ Sidebar Component
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex items-center gap-2">
                  <ForgeSkillsLogo />
                  <span className="text-sm font-medium text-muted-foreground">
                    v1.0.0
                  </span>
                </div>
              </a>
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
              <Collapsible
                key={item.title}
                defaultOpen={index === 0}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {/* Icono si existe */}
                      {item.icon ? (
                        <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      ) : null}
                      <span>{item.title}</span>
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* Subitems */}
                  {/* Subitems */}
{item.items?.length ? (
  <CollapsibleContent>
    <SidebarMenuSub>
      {item.items.map((subItem) => (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuSubButton asChild isActive={!!subItem.isActive}>
            <a href={subItem.url} className="flex items-center gap-2">
              {subItem.icon && (
                <subItem.icon className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{subItem.title}</span>
            </a>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
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
