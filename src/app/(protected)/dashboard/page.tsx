// app/(protected)/dashboard/page.tsx
"use client";

import CursosPanel from "./CursosPanel";

/**
 * DashboardPage
 * Cliente puro (no se puede usar revalidate/dynamic aquí).
 */
export default function DashboardPage() {
  const isDev =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

  return (
    <main className="p-6 md:p-10 space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {isDev
            ? "Modo desarrollo — trabajando directamente con la base de datos local (Supabase Docker)."
            : "Área protegida — autenticación activada en producción."}
        </p>
      </header>

      <section>
        <CursosPanel />
      </section>
    </main>
  );
}
