import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// 🩶 Sans & Mono (de Google)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🖋 Serif local (Claude style)
const notoSerifJP = localFont({
  src: "../../public/fonts/NotoSerifJP-VariableFont_wght.ttf",
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ForgeSkills",
  description: "Un asistente que aprende de tu forma de enseñar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${notoSerifJP.variable}
          antialiased bg-black text-white
        `}
      >
        {children}
      </body>
    </html>
  );
}
