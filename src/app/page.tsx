// src/app/page.tsx
"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-6">
      <h1 className="text-5xl font-bold mb-6">Bienvenido a ForgeSkills</h1>
      <p className="text-lg text-gray-300 max-w-lg mb-10">
        Una plataforma para docentes de FP: organiza tus cursos, alumnos y evaluaciones
        de forma inteligente y segura.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition"
        >
          Registrarse
        </Link>
      </div>
    </main>
  );
}
