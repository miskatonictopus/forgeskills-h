// components/asignaturas/AsociarCursoButtonWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import { AsociarCursoButton } from "./AsociarCursoButton";

export function AsociarCursoButtonWrapper({ asignaturaId }: { asignaturaId: string }) {
  const router = useRouter();
  return (
    <AsociarCursoButton
      asignaturaId={asignaturaId}
      onLinked={() => router.refresh()} // 🔁 vuelve a pedir los datos del server
    />
  );
}