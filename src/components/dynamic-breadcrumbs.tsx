"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type LabelMap = Record<string, string>;

type Props = {
  map?: LabelMap;
  rootLabel?: string;
  rootHref?: string;
};

function prettyLabel(segment: string) {
  const clean = segment.replace(/^\(|\)$/g, "");
  const s = clean.replace(/^\[|\]$/g, "");
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

export function DynamicBreadcrumbs({ map, rootLabel, rootHref = "/" }: Props) {
  const pathname = usePathname();
  const rawSegments = pathname.split("/").filter(Boolean);
  const segments = rawSegments.filter((seg) => !seg.startsWith("(") && !seg.startsWith("_"));

  const parts = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = map?.[seg] ?? prettyLabel(seg);
    return { href, label, isLast: idx === segments.length - 1 };
  });

  const showRoot = !!rootLabel;
  const isSingle = parts.length === 1;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {showRoot && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href={rootHref}>{rootLabel}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {parts.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
          </>
        )}

        {parts.map((p, i) => (
          <React.Fragment key={p.href}>
            <BreadcrumbItem
              className={
                // FIX: solo ocultamos el primer ítem en móvil si no hay root y hay más de uno
                i === 0 && !showRoot && !isSingle ? "hidden md:block" : undefined
              }
            >
              {p.isLast ? (
                <BreadcrumbPage>{p.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={p.href}>{p.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!p.isLast && <BreadcrumbSeparator className="hidden md:block" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
