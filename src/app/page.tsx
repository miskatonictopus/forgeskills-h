"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import Timeline from "@/components/timeline-06"
import Features06Page from "@/components/features-06"


export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
      router.replace(`/auth/callback${window.location.hash}`);
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden transition-colors">
      <SiteHeader />

      {/* === HERO === */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-6 h-40 w-80 mt-8">
          {/* Cambia el logo según el tema */}
          <Image
            src="/img/forgeskills-logo-light.png"
            alt="ForgeSkills Logo"
            fill
            className="object-contain dark:hidden"
            priority
          />
          <Image
            src="/img/forgeskills-logo-dark.png"
            alt="ForgeSkills Logo"
            fill
            className="object-contain hidden dark:block"
            priority
          />
        </div>

        <p className="font-claude mb-10 max-w-3xl text-4xl leading-tight text-foreground">
  HelpDesk docente híbrido que aprende tu forma de enseñar, automatiza la rutina y amplía tu capacidad para centrarte en lo que importa:
  <span className="italic font-bold text-foreground"> tus alumnos</span>.
</p>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center px-6 max-w-3xl mx-auto">
        <Timeline />
      </section>

      <section className="flex flex-1 flex-col items-center justify-center px-6 max-w-6xl mx-auto">
        <Features06Page />
      </section>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ForgeSkills — Todos los derechos reservados.
      </footer>

      {/* Fondo radial sutil que cambia con el tema */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.muted.DEFAULT)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
    </main>
  );
}
