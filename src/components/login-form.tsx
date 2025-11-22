"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginResponse =
  | { ok: true; userId: string | null }
  | { ok: false; error: string };

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const json: LoginResponse = await res
        .json()
        .catch(() => ({ ok: false, error: "Error desconocido" }));

      if (!res.ok || !json.ok) {
        const message =
          !json.ok && json.error === "Invalid login credentials"
            ? "Correo o contraseña incorrectos."
            : !json.ok
            ? json.error
            : "No se pudo iniciar sesión.";
        setError(message);
        return;
      }

      const next = searchParams.get("next") || "/app";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <span className="sr-only">ForgeSkills</span>
            </Link>
            <div className="relative mb-2 h-20 w-40">
              <Image
                src="/img/forgeskills-logo-light.png"
                alt="ForgeSkills Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/img/forgeskills-logo-dark.png"
                alt="ForgeSkills Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
            <div className="text-center text-sm">
              ¿Todavía no tienes una cuenta?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Regístrate.
              </Link>
            </div>
          </div>

          {/* Campos */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
