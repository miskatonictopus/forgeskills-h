// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"; // ⬅️ proveedor de tema

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
    <html lang="es" suppressHydrationWarning>
      {/* ❗️NO forzamos 'dark' aquí: dejamos que next-themes añada/quite la clase */}
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          geistSans.variable,
          geistMono.variable,
          notoSerifJP.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
