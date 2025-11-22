"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || !passwordConfirm) {
      setError("Rellena todos los campos.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("[SIGNUP] error:", error);
        setError(error.message || "No se pudo crear la cuenta.");
        return;
      }

      console.log("[SIGNUP] data:", data);
      setSuccess(
        "Cuenta creada correctamente. Revisa tu correo si se requiere confirmación."
      );

      // Redirigimos al login tras un pequeño delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error("[SIGNUP] unexpected error:", err);
      setError(err?.message ?? "Error inesperado al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground text-sm text-balance">
            Si eres docente de <b>IFP (Barcelona o Madrid)</b> puedes tener una
            versión completa gratis durante un año
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
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
          <FieldDescription>
            Sólo vamos a utilizar este mail para contactarte. No compartiremos
            tu Email con nadie más.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            disabled={loading}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>
            Debe tener al menos 8 carácteres numéricos y alfanuméricos.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            disabled={loading}
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <FieldDescription>Confirma tu Password.</FieldDescription>
        </Field>

        {error && (
          <Field>
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          </Field>
        )}

        {success && (
          <Field>
            <p className="text-sm text-emerald-500" role="status">
              {success}
            </p>
          </Field>
        )}

        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creando cuenta…" : "Crear Cuenta"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            Ya tienes una cuenta? <a href="/login">Entrar</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
