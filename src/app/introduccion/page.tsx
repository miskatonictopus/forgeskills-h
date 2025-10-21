"use client";

import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/Footer";

const introduccion = () => {
    return (

        <main className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden transition-colors">
            <SiteHeader />

            <section className="pb-32">
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
                            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                                Diseñado para docentes que buscan precisión, claridad y tiempo.
                            </h2>
                            <p className="text-muted-foreground text-xl leading-relaxed tracking-tight">
                                ForgeSkills automatiza la planificación, el seguimiento y la evaluación por criterios (RA/CE) con un motor inteligente capaz de analizar, <span className="font-bold">generar y conectar información educativa en segundos</span>, detectando de forma temprana estudiantes en riesgo, creando actividades personalizadas por aula o alumno, y ofreciendo insights accionables para decidir mejor y más rápido.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="py-16">
                    <div className="container">
                        <div className="prose prose-sm dark:prose-invert mx-auto max-w-3xl text-xl">
                            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Cada decisión está respaldada por datos reales.</h2>
                            <p className="leading-relaxed text-muted-foreground">
                                ForgeSkills transforma la información del aula —notas, criterios de evaluación, participación y progreso— en conocimiento accionable.<br/>
                                El sistema identifica patrones, tendencias y desviaciones en tiempo real, permitiendo al docente intervenir con precisión donde más se necesita.<br/>
                                No existe la intuición sin evidencia: <b>hay inteligencia basada en datos educativos reales</b>.
                            </p>

                            <p>
                                Through comprehensive user research and testing, we validate
                                design decisions with real data. Our iterative design process
                                ensures that every element serves a purpose and contributes to
                                your business goals while providing an exceptional user
                                experience.
                            </p>

                            <p>
                                We specialize in creating design systems that scale with your
                                business, ensuring consistency across all touchpoints while
                                maintaining flexibility for future growth and evolution.
                            </p>

                            <p>
                                Our collaborative approach involves stakeholders throughout the
                                design process, from initial wireframes to final prototypes. This
                                ensures alignment between business objectives and user needs,
                                resulting in products that succeed in the market.
                            </p>

                            <p>
                                Every design decision is backed by research and testing, creating
                                solutions that are not just visually appealing but strategically
                                sound and user-validated.
                            </p>

                            <h2>Our UX/UI Design Services</h2>
                            <ul>
                                <li>User research and persona development</li>
                                <li>Information architecture and user journey mapping</li>
                                <li>Wireframing and interactive prototyping</li>
                                <li>Visual design and brand integration</li>
                                <li>Usability testing and design validation</li>
                                <li>Design system creation and documentation</li>
                            </ul>

                            <h2>Strategic Design for Business Success</h2>
                            <p>
                                Our design philosophy centers on creating interfaces that bridge
                                the gap between user needs and business objectives. We understand
                                that great UX/UI design is not just about aesthetics—it's about
                                creating meaningful interactions that drive results.
                            </p>

                            <p>
                                From initial concept to final implementation, we ensure that every
                                design element contributes to a cohesive user experience that
                                reflects your brand values and supports your business goals. Our
                                designs are optimized for performance, accessibility, and
                                scalability across all devices and platforms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default introduccion; // 👈 default export obligatorio en app/introduccion/page.tsx


