"use client";

import * as React from "react";
import { getUserName, saveUserName } from "@/data/userSettings.repo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SplitText from "@/components/animations/SplitText";

export function NameOnboarding() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [alreadySet, setAlreadySet] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const existing = await getUserName();
      if (existing && existing.trim().length > 0) {
        setAlreadySet(true);
      }
      setLoading(false);
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    try {
      setSaving(true);
      await saveUserName(fullName.trim());
      setAlreadySet(true);
    } catch (e) {
      console.error("❌ guardando nombre:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando…
      </div>
    );
  }

  if (alreadySet) return null;

  return (
    <div className="flex h-50 flex-col items-center justify-center space-y-8 overflow-hidden">
  <SplitText
    text="¡Hola!, ¿cuál es tu nombre?"
    className="text-2xl md:text-3xl font-bold text-center leading-tight"
    from={{ opacity: 0, y: 20 }}
    to={{ opacity: 1, y: 0 }}
    ease="power3.out"
  />



      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-3 w-full max-w-xs"
      >
        <Input
          autoFocus
          placeholder="Escribe tu nombre..."
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="text-center"
        />

        <Button
          type="submit"
          disabled={saving || !fullName.trim()}
          className="w-full"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : (
            "Aceptar"
          )}
        </Button>
      </form>
    </div>
  );
}
