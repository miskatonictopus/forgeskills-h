"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { NavigationMenuDemo } from "@/components/navigation-menu-demo"; // ⬅️ demo oficial
import { cn } from "@/lib/utils";

const mobileLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/primitives/alert-dialog", label: "Alert Dialog" },
  { href: "/docs/primitives/hover-card", label: "Hover Card" },
];

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/50 pt-2 pb-2",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/forgeskills-logo-dark.png"
            alt="ForgeSkills"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* MENÚ DESKTOP: demo de shadcn tal cual */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavigationMenuDemo />
          <Separator orientation="vertical" className="mx-2 h-5 bg-white/10" />

          {/* BOTONES */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-zinc-200 text-xs">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-white/90 text-xs">
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </nav>

        {/* MENÚ MÓVIL: lista simple en sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 border-white/10 bg-black">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Image
                  src="/img/forgeskills-logo-dark.png"
                  alt="ForgeSkills"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-2">
              <div className="rounded-md bg-white/5 p-2">
                <div className="px-2 py-1.5 text-sm font-medium text-zinc-200">
                  Navegación
                </div>
                <ul className="grid gap-1">
                  {mobileLinks.map((l) => (
                    <li key={l.href}>
                      <SheetClose asChild>
                        <Link
                          href={l.href}
                          className="block rounded-md px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
                        >
                          {l.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="my-3 bg-white/10" />

              {/* Botones auth */}
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/login">Iniciar sesión</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="justify-start bg-white text-black hover:bg-white/90">
                    <Link href="/register">Registrarse</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
