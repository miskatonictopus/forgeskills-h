"use client";

import * as React from "react";
import { usePersistentStore } from "@/hooks/usePersistentStore";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
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
    { name: "acronimo", label: "Acrónimo", type: "text", required: true, placeholder: "DAMM" },
    { name: "nombre", label: "Nombre del curso", type: "text", required: true, placeholder: "Diseño de Aplicaciones Multiplataforma" },
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
  // Estado del diálogo genérico
  const [openEntityDialog, setOpenEntityDialog] = React.useState(false);
  const [currentEntity, setCurrentEntity] = React.useState<EntityType | null>(null);

  // Prevención de hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Persistencia local
  const [cursos, setCursos] = usePersistentStore<FormValues[]>("fs_cursos", []);

  const openDialogFor = (entity: EntityType) => {
    setCurrentEntity(entity);
    setOpenEntityDialog(true);
  };

  const handleSubmit = async (values: FormValues) => {
    if (!currentEntity) return;

    if (currentEntity === "curso") {
      if (variant === "dev") {
        // 💾 Guardar localmente
        setCursos((prev) => [...prev, values]);
        console.log("💾 Curso guardado local:", values);
        setOpenEntityDialog(false);
      } else {
        // ☁️ Guardar en Supabase
        try {
          const supabase = supabaseBrowser();
          const { error } = await supabase.from("cursos").insert(values);
          if (error) console.error("❌ Error al guardar en Supabase:", error);
          else console.log("✅ Curso guardado en Supabase:", values);
        } catch (e) {
          console.error("❌ Error inesperado:", e);
        } finally {
          setOpenEntityDialog(false);
        }
      }
    }
  };

  // 🧩 Evita el render SSR hasta que esté montado el cliente
  if (!mounted) return null;

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

          {/* Vista previa de cursos persistidos (modo dev) */}
          {variant === "dev" && (
            <section className="grid gap-3 mt-2">
              <h2 className="text-sm font-semibold text-muted-foreground">Cursos (local)</h2>
              {cursos.length === 0 ? (
                <p className="text-xs text-muted-foreground">No hay cursos todavía.</p>
              ) : (
                <div className="grid gap-2">
                  {cursos.map((curso, i) => (
                    <div
                      key={`${curso.acronimo}-${i}`}
                      className="rounded-lg border border-border/30 p-3 bg-zinc-900/80 dark:bg-zinc-900/80 bg-card/60 shadow-sm transition-colors"
                    >
                      <div className="font-medium">{String(curso.nombre ?? "")}</div>
                      <div className="text-xs text-muted-foreground">
                        {String(curso.acronimo ?? "")} — Nivel {String(curso.nivel ?? "")}, {String(curso.grado ?? "")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>

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
        onOpenChange={(v) => {
          if (!v) setCurrentEntity(null); // cierra correctamente
          setOpenEntityDialog(v);
        }}
        title={
          currentEntity ? `Añadir ${currentEntity}` : "Añadir entidad"
        }
        description={
          currentEntity
            ? `Introduce los datos del nuevo ${currentEntity}.`
            : undefined
        }
        _entity={currentEntity ?? "curso"}
        fields={entityConfigs[currentEntity ?? "curso"]}
        submitLabel={`Crear ${currentEntity ?? "curso"}`}
        onSubmit={handleSubmit}
        defaultValues={{}}
      />
      
      )}
    </SidebarProvider>
  );
}
