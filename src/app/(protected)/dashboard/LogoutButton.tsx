"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const onClick = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.replace("/");
    }
  };

  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </Button>
  );
}