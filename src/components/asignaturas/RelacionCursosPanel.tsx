// components/asignaturas/RelacionCursosPanel.tsx
import * as React from "react";
import { getCursosRelacionados } from "@/data/cursos_relacionados.server";

type Props = {
  asignaturaId: string;
  /** Muestra u oculta el bloque inline de "Relacionar con un curso" */
  showInlineRelate?: boolean; // <- NUEVO
};

export async function RelacionCursosPanel({
  asignaturaId,
  showInlineRelate = false, // <- por defecto oculto
}: Props) {
  // 🔹 Carga server-side de cursos ya relacionados
  const cursos = await getCursosRelacionados(asignaturaId); // tu función actual

  return (
    <div className="space-y-4">
      {/* === Tarjeta: Cursos relacionados === */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 text-lg font-semibold">Cursos relacionados</h3>

        {cursos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay cursos relacionados todavía.
          </p>
        ) : (
          <ul className="space-y-2">
            {cursos.map((c) => (
              <li key={c.id} className="rounded-md border bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{c.acronimo}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.nombre} — {c.nivel}: {c.grado}
                    </div>
                  </div>
                  {/* si tienes botón de quitar relación, déjalo aquí */}
                  {/* <RemoveRelacionButton ... /> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* === (ANTES) Panel inline para relacionar === */}
      {showInlineRelate && (
        <div className="rounded-xl border bg-card p-4">
          <h3 className="mb-3 text-lg font-semibold">Relacionar con un curso</h3>
          {/* ⛔️ Este era el buscador/lista inline. Lo dejamos tras el condicional */}
          {/* <BuscadorCursosInline asignaturaId={asignaturaId} /> */}
        </div>
      )}
    </div>
  );
}
