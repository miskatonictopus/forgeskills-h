"use client";

import { useState } from "react";
import { sendReset } from "@/lib/auth/sendReset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await sendReset(email);
      setMessage("✅ Te hemos enviado un enlace para restablecer tu contraseña.");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo enviar el email de recuperación.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleForgotPassword}
        className="w-full max-w-sm space-y-4 rounded-lg border border-zinc-700 bg-card/50 p-6 shadow-md"
      >
        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>

        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-500">{message}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Enviando..." : "Enviar enlace"}
        </Button>
      </form>
    </div>
  );
}
