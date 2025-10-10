"use client";

// components/ui/shadcn-io/calendar.tsx
// Implementación mínima inspirada en https://www.shadcn.io/components/time/calendar
// ✅ Sin dependencias externas salvo date-fns y lucide-react (opcional)
// 🔹 Soporta: navegación por meses/años, locales, render de eventos por día
// 🔹 Arrastrar/soltar y virtualización: fuera de este MVP (se pueden añadir con dnd-kit)

import * as React from "react";
import { addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Locale } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

// ===== Tipos =====
export type CalendarEvent = {
  id: string;
  name: string;
  startAt: Date;
  endAt?: Date; // opcional en este MVP
  color?: string; // hex o tailwind class
};

export type CalendarLocale = {
  locale?: Locale; // de date-fns (es, enUS, etc.)
  weekStartsOn?: 0 | 1; // 0: domingo, 1: lunes
};

// ===== Contexto =====
interface CalendarState {
  current: Date; // mes visible
  setCurrent: (d: Date) => void;
  locale: CalendarLocale;
}

const CalendarCtx = React.createContext<CalendarState | null>(null);

export function CalendarProvider({ children, defaultDate, locale }: { children: React.ReactNode; defaultDate?: Date; locale?: CalendarLocale; }) {
  const [current, setCurrent] = React.useState<Date>(defaultDate ?? new Date());
  return (
    <CalendarCtx.Provider value={{ current, setCurrent, locale: { locale: es, weekStartsOn: 1, ...locale } }}>
      {children}
    </CalendarCtx.Provider>
  );
}

function useCalendar() {
  const ctx = React.useContext(CalendarCtx);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}

// ===== Cabecera de controles (mes/año + paginación) =====
export function CalendarDateControls() {
  const { current, setCurrent, locale } = useCalendar();
  const onPrev = () => setCurrent(addMonths(current, -1));
  const onNext = () => setCurrent(addMonths(current, 1));

  const monthLabel = format(current, "LLLL", { locale: locale.locale });
  const yearLabel = format(current, "yyyy", { locale: locale.locale });

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <CalendarIcon className="size-4" />
        <span className="capitalize">{monthLabel}</span>
        <span className="opacity-70">{yearLabel}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onPrev} className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-muted">
          <ChevronLeft className="size-4" />
        </button>
        <button onClick={onNext} className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-muted">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ===== Encabezado de la grilla (días de la semana) =====
export function CalendarHeader() {
  const { current, locale } = useCalendar();
  const start = startOfWeek(current, { locale: locale.locale, weekStartsOn: locale.weekStartsOn });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  return (
    <div className="grid grid-cols-7 border-b text-xs font-medium">
      {days.map((d) => (
        <div key={d.toISOString()} className="px-2 py-2 text-center uppercase tracking-wide text-muted-foreground">
          {format(d, "EEEEE", { locale: locale.locale })}
        </div>
      ))}
    </div>
  );
}

// ===== Cuerpo de calendario (semanas x días) =====
export function CalendarBody({ events, renderEvent }: { events?: CalendarEvent[]; renderEvent?: (ev: CalendarEvent) => React.ReactNode; }) {
  const { current, locale } = useCalendar();

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart, { locale: locale.locale, weekStartsOn: locale.weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { locale: locale.locale, weekStartsOn: locale.weekStartsOn });

  const days: Date[] = [];
  let day = gridStart;
  while (day <= gridEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const dayEvents = (date: Date) => (events ?? []).filter((ev) => isSameDay(ev.startAt, date));

  return (
    <div className="grid grid-cols-7 gap-px rounded-md border bg-border">
      {days.map((d) => {
        const inMonth = isSameMonth(d, monthStart);
        const label = format(d, "d", { locale: locale.locale });
        const items = dayEvents(d);
        return (
          <div key={d.toISOString()} className={`min-h-28 bg-background p-2 ${inMonth ? "" : "opacity-40"}`}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">{label}</span>
            </div>
            <div className="space-y-1">
              {items.map((ev) => (
                <div
                  key={ev.id}
                  className="truncate rounded-md border px-2 py-1 text-xs"
                  style={{ borderColor: ev.color ?? "#94a3b8" }}
                  title={ev.name}
                >
                  {renderEvent ? renderEvent(ev) : ev.name}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== Picker opcional de mes/año (selects nativos) =====
export function CalendarMonthYearPicker() {
  const { current, setCurrent, locale } = useCalendar();
  const monthIndex = Number(format(current, "M", { locale: locale.locale })) - 1; // 0..11
  const year = Number(format(current, "yyyy", { locale: locale.locale }));

  const months = Array.from({ length: 12 }).map((_, i) => format(new Date(2000, i, 1), "LLLL", { locale: locale.locale }));
  const years = Array.from({ length: 7 }).map((_, i) => year - 3 + i); // ventana de 7 años

  return (
    <div className="flex items-center gap-2">
      <select
        className="rounded-md border bg-background px-2 py-1 text-sm"
        value={monthIndex}
        onChange={(e) => setCurrent(new Date(year, Number(e.target.value), 1))}
      >
        {months.map((m, i) => (
          <option key={m} value={i} className="capitalize">
            {m}
          </option>
        ))}
      </select>
      <select
        className="rounded-md border bg-background px-2 py-1 text-sm"
        value={year}
        onChange={(e) => setCurrent(new Date(Number(e.target.value), monthIndex, 1))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

// ===== Demo (opcional) =====
export function CalendarDemo({ initialEvents }: { initialEvents?: CalendarEvent[] }) {
  const [events] = React.useState<CalendarEvent[]>(
    initialEvents ?? [
      { id: "1", name: "Clase DAMM", startAt: new Date(), color: "#0ea5e9" },
      { id: "2", name: "Reunión claustro", startAt: addDays(new Date(), 2), color: "#22c55e" },
      { id: "3", name: "Entrega Actividad 1", startAt: addDays(new Date(), -3), color: "#f59e0b" },
    ]
  );

  return (
    <CalendarProvider locale={{ locale: es, weekStartsOn: 1 }}>
      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between gap-2">
          <CalendarDateControls />
          <CalendarMonthYearPicker />
        </div>
        <CalendarHeader />
        <CalendarBody events={events} />
      </div>
    </CalendarProvider>
  );
}
