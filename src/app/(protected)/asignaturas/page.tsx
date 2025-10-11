// app/(protected)/asignaturas/page.tsx
import * as React from "react";
import { AsignaturasGrid } from "@/components/dashboard/AsignaturasGrid"; // ajusta la ruta si está en otro sitio
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Mis asignaturas",
};

export default function AsignaturasIndexPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Asignaturas</h1>
      <p className="text-muted-foreground mt-2">
        Todas tus asignaturas. Haz clic en una para ver su detalle.
      </p>
      <Separator className="my-6" />
      <AsignaturasGrid />
    </div>
  );
}
