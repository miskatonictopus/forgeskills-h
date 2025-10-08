// src/components/ForgeSkillsLogo.tsx
"use client";

import Image from "next/image";

export function ForgeSkillsLogo() {
  return (
    <div className="relative h-6 w-[150px]">
      {/* Light */}
      <Image
        src="/img/forgeskills-logo-light.png"
        alt="ForgeSkills"
        fill
        priority
        className="object-contain dark:hidden"
      />
      {/* Dark */}
      <Image
        src="/img/forgeskills-logo-dark.png"
        alt="ForgeSkills"
        fill
        priority
        className="object-contain hidden dark:block"
      />
    </div>
  );
}
