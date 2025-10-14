export type UUID = string & { readonly __brand: "uuid" };

export type AsignaturaSSR = {
  asignatura_id: UUID;             // mapea a asignaturas.id_uuid
  codigo: string | null;
  nombre: string;
  color?: string | null;
  duracion?: string | number | null;
  horas?: number | null;
  horas_totales?: number | null;
  descripcion?: unknown;
};

export type Criterio = {
  id: UUID;
  codigo: string;
  descripcion: string;
};

export type RAConCE = {
  id: UUID;
  codigo: string;
  titulo: string | null;
  descripcion: string;
  criterios_evaluacion: Criterio[];
};

export type CursoResumen = {
  id: UUID;
  acronimo: string | null;
  nombre: string;
  nivel: string | null;
  grado: string | null;
};
