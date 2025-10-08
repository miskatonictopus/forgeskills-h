"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

export function ForgeSkillsLogo() {
  const { resolvedTheme } = useTheme();

  const logoSrc =
    resolvedTheme === "dark"
      ? "/img/forgeskills-logo-dark.png"
      : "/img/forgeskills-logo-light.png";

  return (
    <Image
      src={logoSrc}
      alt="ForgeSkills"
      width={150}
      height={40}
      priority
      className="h-6 w-auto transition-opacity duration-300"
    />
  );
}
