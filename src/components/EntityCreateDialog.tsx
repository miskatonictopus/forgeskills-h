"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"

/* ========= Tipos ========= */

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "textarea"
  | "date"
  | "email"
  | "password";

export type Option = { label: string; value: string };

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: ReadonlyArray<Option>;
};

export type FormValues = Record<string, string | number>;

type EntityCreateDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  _entity?: string;
  fields: ReadonlyArray<FieldConfig>;
  defaultValues?: Partial<FormValues>;
  submitLabel?: string;
  onSubmit: (values: FormValues) => Promise<void> | void;
  loadingText?: string;
};

export function EntityCreateDialog({
  open,
  onOpenChange,
  title,
  description,
  _entity,
  fields,
  defaultValues = {},
  submitLabel = "Guardar",
  loadingText = "Guardando...",
  onSubmit,
}: EntityCreateDialogProps) {
  const [form, setForm] = React.useState<FormValues>(() => {
    const initial: FormValues = {};
    Object.entries(defaultValues).forEach(([k, v]) => {
      if (typeof v === "string" || typeof v === "number") initial[k] = v;
    });
    return initial;
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      const next: FormValues = {};
      Object.entries(defaultValues).forEach(([k, v]) => {
        if (typeof v === "string" || typeof v === "number") next[k] = v;
      });
      setForm(next);
      setError(null);
    }
  }, [open, defaultValues]);

  const handleChange = (name: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validación mínima
      for (const f of fields) {
        if (f.required) {
          const v = form[f.name];
          if (v === undefined || v === "") {
            throw new Error(`El campo "${f.label}" es obligatorio.`);
          }
        }
      }

      // Si estamos creando una asignatura, importamos RA/CE automáticamente
      if (title.toLowerCase().includes("asignatura")) {
        const codigo = String(form["codigo"] || "").trim();
        if (!codigo) throw new Error("Falta el código de la asignatura para importar RA/CE.");

        const res = await fetch("/api/asignaturas/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo }),
        });

        const data = await res.json();

        if (!data.ok) {
          throw new Error(data.error || "Error al importar los RA/CE desde el JSON remoto.");
        }

        toast.success(`Asignatura "${data.asignatura}" importada con RA y CE.`);
      }

      await onSubmit(form);
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (f: FieldConfig) => {
    const value = form[f.name] ?? "";

    if (f.type === "select") {
      return (
        <div key={f.name} className="grid gap-2">
          <Label htmlFor={f.name}>
            {f.label} {f.required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={String(value)}
            onValueChange={(v: string) => handleChange(f.name, v)}
          >
            <SelectTrigger id={f.name}>
              <SelectValue placeholder={f.placeholder || "Selecciona una opción"} />
            </SelectTrigger>
            <SelectContent>
              {(f.options ?? []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (f.type === "textarea") {
      return (
        <div key={f.name} className="grid gap-2">
          <Label htmlFor={f.name}>
            {f.label} {f.required && <span className="text-red-500">*</span>}
          </Label>
          <Textarea
            id={f.name}
            placeholder={f.placeholder}
            value={String(value)}
            onChange={(e) => handleChange(f.name, e.target.value)}
          />
        </div>
      );
    }

    if (f.type === "number") {
      return (
        <div key={f.name} className="grid gap-2">
          <Label htmlFor={f.name}>
            {f.label} {f.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={f.name}
            type="number"
            placeholder={f.placeholder}
            value={value === "" ? "" : String(value)}
            onChange={(e) =>
              handleChange(f.name, e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
      );
    }

    return (
      <div key={f.name} className="grid gap-2">
        <Label htmlFor={f.name}>
          {f.label} {f.required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={f.name}
          type={f.type}
          placeholder={f.placeholder}
          value={String(value)}
          onChange={(e) => handleChange(f.name, e.target.value)}
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-lg border border-border/40 shadow-xl bg-background/80",
          "dark:[&]:bg-zinc-900"
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">{fields.map(renderField)}</div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} variant="default">
              {loading ? loadingText : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
