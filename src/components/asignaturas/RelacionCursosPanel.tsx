// src/components/asignaturas/RelacionCursosPanel.tsx
"use client";

import { useState } from "react";
import { CursosRelacionados } from "./CursosRelacionados";
import { VincularCurso } from "./VincularCurso";

type Props = {
  asignaturaId: string;
};

export function RelacionCursosPanel({ asignaturaId }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-4">
      <CursosRelacionados
        key={refreshKey} // fuerza recarga cuando se añade/borra
        asignaturaId={asignaturaId}
      />
      <VincularCurso
        asignaturaId={asignaturaId}
        onLinked={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
