"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [err, setErr] = useState<string|null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setLoading(true);
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setLoading(false); return; }
    router.push("/dashboard"); router.refresh();
  };

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <div><label className="block text-sm">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email}
                 onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></div>
        <div><label className="block text-sm">Contraseña</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password}
                 onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded bg-black text-white py-2" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
        <p className="text-sm">¿No tienes cuenta? <a className="underline" href="/register">Regístrate</a></p>
      </form>
    </main>
  );
}
