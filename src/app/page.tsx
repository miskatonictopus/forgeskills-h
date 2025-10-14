"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function LandingPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
      router.replace(`/auth/callback${window.location.hash}`);
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden">
      <SiteHeader />

      {/* HERO */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-6 h-40 w-80">
          <Image
            src="/img/forgeskills-logo-dark.png"
            alt="ForgeSkills Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="font-claude mb-10 max-w-3xl text-2xl leading-relaxed text-gray-300">
          Asistente docente híbrido que aprende tu forma de enseñar, automatiza la rutina
          y amplía tu capacidad para centrarte en lo que importa:
          <span className="italic font-bold"> tus alumnos</span>.
        </p>

        
      </section>

      <footer className="py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ForgeSkills — Todos los derechos reservados.
      </footer>

      {/* Fondo radial sutil */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
    </main>
  );
}
