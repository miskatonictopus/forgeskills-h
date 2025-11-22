"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

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

  React.useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabaseBrowser().auth.getSession();
      if (session) {
        const next = searchParams.get("next") || "/app";
router.replace(next);
      }
    };
    check();
  }, [router, searchParams]);

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
        .catch(() => ({ error: "Error desconocido" } as any));

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

            {/* Logo light/dark */}
            <div className="relative mb-2 h-20 w-40">
              {/* Logo para tema claro */}
              <Image
                src="/img/forgeskills-logo-light.png"
                alt="ForgeSkills Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              {/* Logo para tema oscuro */}
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
              {loading ? "Logging in…" : "Login"}
            </Button>
          </div>

          {/* Separador + sociales */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              O
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              disabled
            >
              {/* Apple */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M16.365 1.43c0 1.14-.42 2.058-1.02 2.847-.642.84-1.803 1.54-2.897 1.453-.144-1.104.428-2.17 1.035-2.88.665-.787 1.87-1.357 2.882-1.42zM20.16 17.58c-.533 1.23-.78 1.777-1.463 2.86-.95 1.515-2.29 3.4-3.94 3.416-1.473.013-1.85-.987-3.847-.974-1.997.012-2.42.99-3.894.978-1.65-.016-2.924-1.72-3.874-3.232-2.653-4.225-2.93-9.186-1.294-11.806 1.153-1.85 2.977-2.95 4.692-2.95 1.74 0 2.835.998 4.272.998 1.396 0 2.25-.998 4.27-.998 1.522 0 3.13.826 4.282 2.254-3.78 2.14-3.165 7.72.076 9.45z" />
              </svg>
              Continue with Apple
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              disabled
            >
              {/* Google */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </form>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="/legal/terms">Terms of Service</Link> and{" "}
        <Link href="/legal/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
