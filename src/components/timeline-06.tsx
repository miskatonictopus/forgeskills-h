import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  {
    title: (
      <>
        <strong>Febrero 2025:</strong> Investigación
      </>
    ),
    description:
      "El docente necesita centrarse en el alumnado y la carga burocrática aplicada sobre el profesorado por la actual LOMLOE impide dedicar el tiempo necesario que muchos alumnos necesitan. Investigamos los principales puntos de dolor en el proceso para conseguir un asistente docente que agilice estos procedimientos.",
    completed: true,
  },
  {
     title: (
      <>
        <strong>Junio 2025:</strong> Inicio del desarrollo
      </>
    ),
    description:
      "El proyecto Forgeskills se comienza a desarrollar no solo con el objetivo de liberar al docente de la carga burocrática, sino que, analizando los recursos actuales disponibles, desarrollamos nuestros asistentes, potenciando las habilidades de cada alumno, permitiendo al docente aplicarse a fondo en sus competencias para impartir clases y crear contenidos de calidad.",
    completed: true,
  },
  {
     title: (
      <>
        <strong>Actualidad</strong> Desarrollo e implementación
      </>
    ),
    description:
      "Disponemos de un prototipo funcional desarrollado en Electron como mula de pruebas y estamos desarrollando nuestra primera versión funcional en Vercel y Supabase para producción online",
    completed: true,
  },
  {
     title: (
      <>
        <strong>Diciembre 2025</strong> Primera versión βeta funcional para test
      </>
    ),
    description:
      "Lanzamiento de la primera versión βeta para el testeo en tiempo real por parte del equipo de βeta testers.",
  },
  {
     title: (
      <>
        <strong>Marzo 2026</strong> Lanzamiento online para docentes de Formación Profesional
      </>
    ),
    description:
      "Esperamos tener disponible para esta fecha una versión totalmente funcional y testada para todas las ramas de Formación Profesional.",
  },
];

export default function Timeline() {
  return (
    <div className="max-w-(--breakpoint-sm) mx-auto py-12 md:py-20 px-6">
      <div className="relative ml-6">
        {/* Línea vertical del timeline */}
        <div className="absolute left-0 inset-y-0 border-l-2 border-border" />

        {steps.map(({ title, description, completed }, index) => (
          <div key={index} className="relative pl-10 pb-10 last:pb-0">
            {/* Icono circular */}
            <div
              className={cn(
                "absolute left-px -translate-x-1/2 h-9 w-9 border-2 border-muted-foreground/40 flex items-center justify-center rounded-full bg-accent ring-8 ring-background",
                {
                  "bg-primary border-primary text-primary-foreground":
                    completed,
                }
              )}
            >
              <span className="font-semibold text-lg">
                {completed ? <Check className="h-5 w-5" /> : index + 1}
              </span>
            </div>

            {/* Contenido */}
            <div className="pt-1 space-y-2">
              <h3 className="text-xl font-medium tracking-tight">
                {title}
              </h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
