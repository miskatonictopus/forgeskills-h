"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OnboardingNameCard({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Pon tu nombre, por favor.");
    setError(null);
    setLoading(true);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, email, full_name: name.trim() }, { onConflict: "id" });
      if (error) throw error;
      router.refresh();
    } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "No se pudo guardar.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <Card className="w-full max-w-md shadow-xl border border-border bg-background-foreground">
          <CardHeader>
            <CardTitle className="text-lg">¡Bienvenido/a!</CardTitle>
            <CardDescription>
              Antes de empezar necesitamos saber tu nombre!. <br />
              <span className="text-xs">Iniciaste sesión como <b>{email}</b>.</span>
            </CardDescription>
          </CardHeader>

          <form onSubmit={onSubmit}>
            <CardContent className="space-y-3">
              <label className="text-sm font-medium" htmlFor="name">
                Tu nombre
              </label>
              <Input
                id="name"
                placeholder="Escribe tu nombre..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>

            <CardFooter className="justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar y continuar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
