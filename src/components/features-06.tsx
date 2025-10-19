import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    category: "Tecnología Híbrida",
    title: "Eliminamos las alucinaciones actuales de la IA",
    details:
      "Nuestros modelos híbridos combinan razonamiento simbólico y aprendizaje profundo para eliminar las alucinaciones. Cada decisión de la IA se canaliza por un túnel de verificación que asegura precisión, trazabilidad y coherencia total.",
    image: "/img/hybrid-tunnel.jpg", // 📸
  },
  {
    category: "Potencia de Procesamiento",
    title: "Planificación inteligente",
    details:
      "Crea programaciones didácticas completas para todo el curso, por semestres, trimestres o periodos personalizados. Incluye automáticamente los días festivos, analiza la dificultad de cada RA y CE, y distribuye los contenidos de forma equilibrada e inteligente con las metologías ideales para cada contenido.",
    tutorialLink: "#",
    image: "/img/prog-didact.jpg",
  },
  {
    category: "Evaluación Precisa",
    title: "Corrección coherente y alineada con los resultados",
    details:
      "ForgeSkills emplea un sistema de detección semántica reproducible que compara el texto de la actividad con los RA y CE oficiales. Sin depender del azar de la IA, identifica de manera lógica y verificable los criterios que evalúa cada tarea, asegurando coherencia pedagógica y transparencia en la calificación.",
    tutorialLink: "#",
    image: "/img/actividad-detectar.jpg",
  },
  {
    category: "Creación Adaptativa",
    title: "Generación dinámica de actividades",
    details:
      "Define la duración, elige los resultados que quieres evaluar y deja que ForgeSkills diseñe la actividad perfecta para tu grupo. Nuestros modelos, trabajando de forma sincronizada, calibran la dificultad ideal y adaptan cada ejercicio para mantener el ritmo y la motivación del aula.",
    tutorialLink: "#",
    image: "/img/creacion-adaptativa.jpg",
  },
  {
    category: "Intervención Adaptativa",
    title: "Detección Temprana y Refuerzo Adaptativo",
    details:
      "Mediante el análisis continuo del rendimiento, ForgeSkills identifica patrones de bajo rendimiento o riesgo académico. Nuestro sistema propone actividades específicas, ajustadas en dificultad y objetivos, para potenciar las áreas de mejora de cada alumno o grupo.",
    tutorialLink: "#",
    image: "/img/deteccion-temprana.jpg",
  },
];


const Features06Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-(--breakpoint-lg) w-full py-10 px-6">
        <h2 className="font-claude text-4xl md:text-[2.75rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty sm:mx-auto sm:text-center">
          Fortalece tus habilidades
        </h2>
        <p className="mt-2 text-muted-foreground text-lg sm:text-xl sm:text-center">
          Mejora tus cualidades con herramientas inteligentes diseñadas para el éxito.
        </p>
        <div className="mt-8 md:mt-16 w-full mx-auto space-y-20">
          {features.map((feature) => (
            <div
              key={feature.category}
              className="flex flex-col md:flex-row items-center gap-x-12 gap-y-6 md:even:flex-row-reverse"
            >
              <div className="w-full aspect-[4/3] bg-muted rounded-xl border border-border/50 basis-1/2 overflow-hidden relative">
 <Image
  src={feature.image || "/img/default.jpg"}
  alt={feature.title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
  priority
/>
</div>
              <div className="basis-1/2 shrink-0">
                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="font-claude my-3 text-3xl font-semibold tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">{feature.details}</p>
                {/* <Button asChild size="lg" className="mt-6 rounded-full gap-3">
                  <Link href={feature.tutorialLink}>
                    Learn More <ArrowRight />
                  </Link>
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features06Page;
