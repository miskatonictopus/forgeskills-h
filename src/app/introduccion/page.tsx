"use client";

import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/Footer";

const introduccion = () => {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden transition-colors">
      <SiteHeader />
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          {/* Full Width Hero */}
          <div className="bg-background flex items-center justify-center min-h-[40vh]">
            <div className="container text-center">
              <h1 className="text-4xl font-claude tracking-tighter md:text-5xl lg:text-6xl">
                Donde la inteligencia se une a la enseñanza.
              </h1>
            </div>
          </div>

          {/* Intro Section */}
          <div className="py-16">
            <div className="container">
              <div className="mx-auto max-w-3xl space-y-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Transforma la forma en la que enseñas
                </h2>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Forgeskills automatiza la planificación, el seguimiento y la
                  evaluación por criterios (RA/CE) con un motor inteligente
                  capaz de analizar,{" "}
                  <span className="font-bold">
                    generar y conectar información educativa en segundos
                  </span>
                  , detectando de forma temprana estudiantes en riesgo, creando
                  actividades personalizadas por aula o alumno, y ofreciendo
                  insights accionables para decidir mejor y más rápido.
                </p>
              </div>
            </div>
            <div className="container mt-20">
              <div className="mx-auto max-w-3xl space-y-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Automatiza lo que te quita tiempo. Potencia lo que te hace
                  único
                </h2>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Forgeskills entiende que la enseñanza no debería estar
                  dominada por tareas repetitivas. Por eso automatiza la
                  planificación, la evaluación y el seguimiento, conectando
                  criterios, actividades y resultados de aprendizaje en
                  segundos.
                </p>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Mientras nuestros LLM especialmente desarrollados organizan
                  tus datos, tú recuperas tiempo para lo que de verdad importa:
                  <span className="font-bold">
                    inspirar, acompañar y formar.
                  </span>
                </p>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Cada algoritmo trabaja para que tu talento pedagógico brille.
                  Cada decisión está guiada por información precisa, no por
                  suposiciones. Automatiza lo que te quita tiempo. Potencia lo
                  que te hace único:
                  <span className="font-bold"> tu forma de enseñar.</span>
                </p>
              </div>
            </div>
            <div className="container mt-20">
              <div className="mx-auto max-w-3xl space-y-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Planifica, evalúa y mejora cada aprendizaje
                </h2>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Planificar no debería ser una carga, sino una oportunidad para
                  diseñar experiencias de aprendizaje más efectivas.
                </p>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Forgeskills te acompaña en todo el proceso: desde la creación
                  de tu programación didáctica hasta la evaluación individual
                  por criterios (RA/CE). La plataforma analiza automáticamente
                  las relaciones entre resultados, actividades y evidencias,
                  ofreciéndote una visión completa del progreso de tus alumnos.
                  Cada nota, cada observación y cada tarea se transforman en
                  información útil para mejorar la enseñanza día a día.
                </p>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Detecta puntos fuertes, identifica áreas de mejora y ajusta
                  tus estrategias con precisión. Con Forgeskills, planificar
                  deja de ser un trámite para convertirse en una herramienta de
                  crecimiento docente y aprendizaje real.
                </p>
              </div>
            </div>
            <div className="container mt-20">
              <div className="mx-auto max-w-3xl space-y-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Menos horas de gestión. Más tiempo para inspirar
                </h2>
                <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Cada minuto que dedicas a cuadrar horarios, registrar notas o
                  completar informes es tiempo que pierdes para inspirar, guiar
                  y acompañar a tus alumnos.</p>
                  <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Forgeskills automatiza las tareas
                  administrativas y pedagógicas más repetitivas, para que puedas
                  concentrarte en lo que realmente importa: enseñar con
                  propósito. El sistema organiza tus cursos, conecta los
                  resultados de aprendizaje (RA) con los criterios de evaluación
                  (CE) y genera informes automáticos que antes llevaban horas.</p>
                  <p className="text-foreground font-claude text-xl leading-relaxed tracking-tight text-justify">
                  Todo sincronizado, visual y accesible desde un único lugar.
                  Porque la educación no necesita más papeleo, necesita más
                  espacio para la creatividad, la empatía y la innovación.
                  Forgeskills no reemplaza tu labor docente — <span className="font-bold">la amplifica.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default introduccion;
