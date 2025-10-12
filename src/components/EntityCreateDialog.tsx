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
  open: controlledOpen,
  onOpenChange,
  ...props
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  [key: string]: any;
}) {
  const [internalOpen, setInternalOpen] = React.useState(controlledOpen ?? false);

  // ✅ Sincroniza con el estado externo solo cuando cambia realmente
  React.useEffect(() => {
    if (controlledOpen !== undefined && controlledOpen !== internalOpen) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen, internalOpen]);

  // ✅ Notifica al padre sólo cuando hay cambio real
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setInternalOpen(next);
      if (onOpenChange && next !== controlledOpen) {
        onOpenChange(next);
      }
    },
    [onOpenChange, controlledOpen]
  );

  return (
    <Dialog open={internalOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          {props.description && (
            <DialogDescription>{props.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* ... resto del formulario interno ... */}
      </DialogContent>
    </Dialog>
  );
}
