// src/components/ProtectedShell.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // 👈 importa router
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { AppSidebar } from "@/components/app-sidebar";
import {
  EntityCreateDialog,
  type FieldConfig,
  type FormValues,
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
    { name: "acronimo", label: "Acrónimo", type: "text", required: true, placeholder: "SMX / ASIX / DAM / DAW" },
    { name: "nombre",   label: "Nombre del curso", type: "text", required: true, placeholder: "Sistemas Microinformáticos y Redes" },
    {
      name: "nivel", label: "Nivel", type: "select", required: true,
      options: [{ label: "1", value: "1" }, { label: "2", value: "2" }],
    },
    {
      name: "grado", label: "Grado", type: "select", required: true,
      options: [{ label: "medio", value: "medio" }, { label: "superior", value: "superior" }],
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
  const router = useRouter(); // 👈 usa router

  // Diálogo genérico
  const [openEntityDialog, setOpenEntityDialog] = React.useState(false);
  const [currentEntity, setCurrentEntity] = React.useState<EntityType | null>(null);

  // Evitar hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const openDialogFor = (entity: EntityType) => {
    setCurrentEntity(entity);
    setOpenEntityDialog(true);
  };

  // Guarda SIEMPRE en Supabase (dev y prod) y refresca el server component
  const handleSubmit = async (values: FormValues): Promise<void> => {
    if (!currentEntity) return;
    try {
      const supabase = supabaseBrowser();

      if (currentEntity === "curso") {
        const payload = {
          acronimo: String(values.acronimo ?? "").trim(),
          nombre:   String(values.nombre ?? "").trim(),
          nivel:    String(values.nivel ?? "").trim(),
          grado:    String(values.grado ?? "").trim(),
        };
        const { error } = await supabase.from("cursos").insert([payload]);
        if (error) throw error;

        // 🔄 vuelve a renderizar el Dashboard (server component) para que aparezca la tarjeta nueva
        router.refresh();
      }

      // TODO: añadir inserciones para "asignatura" y "alumno" cuando estén las tablas
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : typeof e === "string" ? e : "Error desconocido al guardar la entidad.";
      console.error("❌ Error al guardar entidad:", message);
    } finally {
      setOpenEntityDialog(false);
      setCurrentEntity(null);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar onAddCourse={() => openDialogFor("curso")} />

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
                <Separator orientation="vertical" className="h-6 mx-2" />
                <LogoutButton />
              </>
            )}
          </div>
        </header>

        {/* MAIN */}
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t px-4 py-2 text-sm text-muted-foreground flex justify-between items-center">
          {variant === "prod" ? (
            <div><b>{fullName ?? "Sin nombre definido"}</b> — {userEmail ?? "sin_email"}</div>
          ) : (
            <div><b>Invitado (dev)</b> — autenticación desactivada</div>
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
          onOpenChange={(v) => {
            if (!v) setCurrentEntity(null);
            setOpenEntityDialog(v);
          }}
          title={`Añadir ${currentEntity}`}
          description={`Introduce los datos del nuevo ${currentEntity}.`}
          _entity={currentEntity}
          fields={entityConfigs[currentEntity]}
          submitLabel={`Crear ${currentEntity}`}
          onSubmit={handleSubmit}
          defaultValues={{}}
        />
      )}
    </SidebarProvider>
  );
}
