// app/(protected)/calendario/page.tsx
"use client";
import * as React from "react";
import { CalendarDemo, type CalendarEvent } from "@/components/ui/shadcn-io/calendar";

export default function Page() {
  const eventos: CalendarEvent[] = [
    { id: "1", name: "Clase DAMM", startAt: new Date(), color: "#0ea5e9" },
    { id: "2", name: "Reunión claustro", startAt: new Date(Date.now()+2*86400000), color: "#22c55e" },
  ];
  return (
    <div className="p-4">
      <CalendarDemo initialEvents={eventos} />
    </div>
  );
}
