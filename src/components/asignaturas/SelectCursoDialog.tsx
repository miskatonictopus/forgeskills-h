"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { listarCursos, type Curso } from "@/data/cursos.repo";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (cursoId: string) => void;
};

export function SelectCursoDialog({ open, onOpenChange, onConfirm }: Props) {
  const [cursos, setCursos] = React.useState<Curso[]>([]);
  const [selected, setSelected] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    listarCursos()
      .then(setCursos)
      .catch((e) => console.error("Error cargando cursos:", e))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Selecciona un curso</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-3 text-sm text-muted-foreground">Cargando cursos…</div>
        ) : cursos.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">No hay cursos registrados.</div>
        ) : (
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Elegir curso…" />
            </SelectTrigger>
            <SelectContent>
              {cursos.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.acronimo}{c.nivel}— {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => selected && onConfirm(selected)} disabled={!selected}>
            Asociar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
