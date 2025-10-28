"use client";

import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/Footer";

export default function DeteccionTempranaPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden transition-colors">
      <SiteHeader />
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          {/* Full Width Hero */}
          <div className="bg-background flex items-center justify-center min-h-[40vh]">
            <div className="container text-center">
              <h1 className="text-4xl font-claude tracking-tighter md:text-5xl lg:text-6xl">
                Detección temprana de alumnos en riesgo
              </h1>
            </div>
          </div>

          {/* Intro Section */}
          <div className="py-16">
            <div className="container">
              <div className="mx-auto max-w-3xl space-y-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Anticípate a los resultados
                </h2>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Con un sistema heurístico propio combinado con los más avanzados LLM, Forgeskills identifica automáticamente a los estudiantes que muestran señales de bajo rendimiento o descenso progresivo en sus calificaciones. En segundos, sabrás quién necesita atención inmediata, en qué criterios (CE) falla y qué acciones puedes tomar.
                </p>
              </div>
            </div>

            <div className="container mt-20">
              <div className="mx-auto max-w-3xl space-y-8 text-left">
<h2 className="text-3xl font-bold tracking-tight md:text-4xl">
  Inteligencia que observa tendencias
</h2>

<p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
  Nuestro sistema monitoriza y analiza todas las actividades y evaluaciones de cada alumno
  para detectar patrones:
</p>

<ul className="list-disc pl-4 marker:text-foreground/80 space-y-2 text-lg leading-relaxed font-claude">
  <li className="pl-2 text-justify">Descensos abruptos en notas recientes.</li>
  <li className="pl-2 text-justify">
    Falta de progreso en determinados Resultados de Aprendizaje (RA) o Criterios de Evaluación (CE).
  </li>
  <li className="pl-2 text-justify">
    Comparativas frente al grupo y frente a su propio historial.
  </li>
</ul>

<p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
  Todo ello se muestra visualmente en el dashboard con indicadores de riesgo, ayudándote a
  intervenir antes de que llegue el suspenso.
</p>

              </div>
            </div>

            <div className="container mt-20">
              <div className="mx-auto max-w-3xl space-y-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Acciones inteligentes para revertir la situación
                </h2>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Cuando ForgeSkills identifica a un alumno en riesgo, sugiere actividades personalizadas centradas en los Criterios de Evaluación que necesita reforzar.

Puedes generarlas con un clic, adaptadas a su nivel, ritmo y área de mejora.</p>
<p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
Es la forma más eficiente de convertir datos en acción pedagógica.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
