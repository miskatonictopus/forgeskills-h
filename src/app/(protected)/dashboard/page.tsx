// app/(protected)/dashboard/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // 🟢 En desarrollo, bypass total (sin auth, sin datos)
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
  ) {
    return (
      <main className="p-6 md:p-10">
        {/* espacio libre para el contenido del dashboard */}
      </main>
    );
  }

  // 🔐 En producción, la lógica de auth ya está en el layout,
  // así que aquí solo renderizamos el contenido del dashboard
  return (
    <main className="p-6 md:p-10">
      {/* espacio libre para el contenido real */}
    </main>
  );
}
