"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-6 relative overflow-hidden">
      <div className="relative w-80 h-40 mb-4">
        <Image
          src="/img/forgeskills-logo-dark.png"
          alt="ForgeSkills Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <p className="text-2xl text-gray-300 max-w-3xl mb-10 leading-relaxed font-claude">
      Asistente docente híbrido que aprende tu forma de enseñar, automatiza la rutina
y amplía tu capacidad para centrarte en lo que importa:<span className="font-bold italic"> tus alumnos</span>.
      </p>

      {/* BOTONES */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
        >
          Registrarse
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-6 text-xs text-gray-500">
        © {new Date().getFullYear()} ForgeSkills — Todos los derechos reservados.
      </footer>

      {/* Fondo sutil con degradado radial */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
    </main>
  );
}
