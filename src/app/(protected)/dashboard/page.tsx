import { supabaseServer } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Usuario: <b>{user?.email}</b></p>
      <form action="/api/signout" method="post">
        <button className="border rounded px-3 py-2">Cerrar sesión</button>
      </form>
    </main>
  );
}
