"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? "No se pudo iniciar sesión.");
        return;
      }

      // 🔁 MUY IMPORTANTE en App Router: refrescar el árbol
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Error de red. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={onSubmit}
        className="w-[420px] rounded-xl border border-white/20 p-6 space-y-4"
      >
        <h2 className="text-2xl font-semibold">Entrar</h2>

        <label className="block text-sm">
          Email
          <input
            className="mt-1 w-full rounded border border-white/20 bg-black/30 px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block text-sm">
          Contraseña
          <input
            className="mt-1 w-full rounded border border-white/20 bg-black/30 px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md border px-4 py-2 text-lg disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
