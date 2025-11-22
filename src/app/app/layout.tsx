// src/app/app/layout.tsx
"use client";

import * as React from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Aquí luego metemos sidebar, header interno, etc. */}
      {children}
    </div>
  );
}