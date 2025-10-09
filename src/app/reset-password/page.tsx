// src/app/reset-password/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!p1 || p1 !== p2) return setErr("Las contraseñas no coinciden.");
    const { auth } = supabaseBrowser();
    const { error } = await auth.updateUser({ password: p1 });
    if (error) return setErr(error.message);
    setOk(true);
    setTimeout(async () => {
      await auth.signOut();
      router.replace("/login");
    }, 800);
  };

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-xl font-semibold">Nueva contraseña</h1>
      {err && <p className="mb-3 text-sm text-red-500">{err}</p>}
      {ok ? (
        <p className="text-sm">Contraseña actualizada. Redirigiendo…</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Nueva contraseña</Label>
            <Input type="password" value={p1} onChange={(e) => setP1(e.target.value)} />
          </div>
          <div>
            <Label>Repite la contraseña</Label>
            <Input type="password" value={p2} onChange={(e) => setP2(e.target.value)} />
          </div>
          <Button type="submit">Guardar</Button>
        </form>
      )}
    </div>
  );
}
