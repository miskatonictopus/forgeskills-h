import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-6 text-xl">
        Usuario: <b>{data.user.email}</b>
      </p>
      <div className="mt-8">
        <LogoutButton />
      </div>
    </main>
  );
}
