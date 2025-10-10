"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  EntityCreateDialog,
  FieldConfig,
  FormValues,
} from "@/components/EntityCreateDialog";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";
import { LogoutButton } from "@/app/(protected)/dashboard/LogoutButton";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type EntityType = "curso" | "asignatura" | "alumno";

const entityConfigs: Record<EntityType, ReadonlyArray<FieldConfig>> = {
  curso: [
    {
      name: "acronimo",
      label: "Acrónimo",
      type: "text",
      required: true,
      placeholder: "DAMM",
    },
    {
      name: "nombre",
      label: "Nombre del curso",
      type: "text",
      required: true,
      placeholder: "Diseño de Aplicaciones Multiplataforma",
    },
    {
      name: "nivel",
      label: "Nivel",
      type: "select",
      required: true,
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
      ],
    },
    {
      name: "grado",
      label: "Grado",
      type: "select",
      required: true,
      options: [
        { label: "medio", value: "medio" },
        { label: "superior", value: "superior" },
      ],
    },
  ],
  asignatura: [
    { name: "codigo", label: "Código", type: "text", required: true, placeholder: "0490" },
    { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Programación" },
  ],
  alumno: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "apellidos", label: "Apellidos", type: "text", required: true },
  ],
};

type Props = {
  children: React.ReactNode;
  variant: "dev" | "prod";
  fullName?: string;
  userEmail?: string;
};

export default function ProtectedShell({
  children,
  variant,
  fullName,
  userEmail,
}: Props) {
  const [openEntityDialog, setOpenEntityDialog] = React.useState(false);
  const [currentEntity, setCurrentEntity] = React.useState<EntityType | null>(null);

  const openDialogFor = (entity: EntityType) => {
    setCurrentEntity(entity);
    setOpenEntityDialog(true);
  };

  const handleSubmit = async (values: FormValues) => {
    if (!currentEntity) return;
    // Conecta persistencia aquí según entidad:
    // if (currentEntity === "curso") await supabase.from("cursos").insert([values]);
    console.log(`Guardar ${currentEntity}:`, values);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onAddCourse={() => openDialogFor("curso")}
        // onAddAsignatura={() => openDialogFor("asignatura")}
        // onAddAlumno={() => openDialogFor("alumno")}
      />

      <SidebarInset>
        {/* HEADER */}
        <header className="relative z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <DynamicBreadcrumbs map={{ dashboard: "Dashboard", cursos: "Mis cursos" }} />
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitch />
            {variant === "prod" && (
              <>
                <Separator orientation="vertical" className="h-6 data-[orientation=vertical]:h-6 mx-2" />
                <LogoutButton />
              </>
            )}
          </div>
        </header>

        {/* MAIN */}
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>

        {/* FOOTER */}
        <footer className="border-t px-4 py-2 text-sm text-muted-foreground flex justify-between items-center">
          {variant === "dev" ? (
            <div><b>Invitado (dev)</b> — autenticación desactivada</div>
          ) : (
            <div><b>{fullName ?? "Sin nombre definido"}</b> — {userEmail ?? "sin_email"}</div>
          )}
          <span className="text-xs text-muted-foreground/70">
            ForgeSkills © {new Date().getFullYear()}
          </span>
        </footer>
      </SidebarInset>

      {/* DIALOG GENÉRICO */}
      {currentEntity && (
        <EntityCreateDialog
          open={openEntityDialog}
          onOpenChange={setOpenEntityDialog}
          title={`Añadir ${currentEntity}`}
          description={`Introduce los datos del nuevo ${currentEntity}.`}
          _entity={currentEntity}
          fields={entityConfigs[currentEntity]}
          submitLabel={`Crear ${currentEntity}`}
          onSubmit={handleSubmit}
          defaultValues={{}} // evita castings
        />
      )}
    </SidebarProvider>
  );
}
