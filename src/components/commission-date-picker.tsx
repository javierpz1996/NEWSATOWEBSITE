"use client";

import { formatCommissionDateLabel, parseIsoDateToLocal } from "@/lib/commission-date-format";
import { useEffect, useId, useRef, useState } from "react";

const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

function buildCalendarDays(viewMonth: Date): CalendarDay[] {
  const first = startOfMonth(viewMonth);
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startOffset);

  const days: CalendarDay[] = [];
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    days.push({
      date,
      inCurrentMonth: date.getMonth() === viewMonth.getMonth(),
    });
  }
  return days;
}

type CommissionDatePickerProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
};

export function CommissionDatePicker({ id, name, label, required }: CommissionDatePickerProps) {
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

  const selectedDate = value ? parseIsoDateToLocal(value) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const monthTitle = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  const displayValue = value ? formatCommissionDateLabel(value) : "Elegir fecha";

  const selectDay = (date: Date) => {
    setValue(toIsoDate(date));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="commission-date-picker">
      <label className="sales-page__gate-label" htmlFor={id}>
        {label}
      </label>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        id={id}
        type="button"
        className="commission-date-picker__trigger sales-page__gate-input"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) {
            setViewMonth(startOfMonth(selectedDate ?? new Date()));
          }
          setOpen(!open);
        }}
      >
        <span>{displayValue}</span>
        <span className="commission-date-picker__trigger-icon" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div
          id={popoverId}
          className="commission-date-picker__popover"
          role="dialog"
          aria-label={`Calendario para ${label}`}
        >
          <div className="commission-date-picker__header">
            <button
              type="button"
              className="commission-date-picker__nav"
              aria-label="Mes anterior"
              onClick={() => setViewMonth((current) => addMonths(current, -1))}
            >
              ←
            </button>
            <p className="commission-date-picker__month">{monthTitle}</p>
            <button
              type="button"
              className="commission-date-picker__nav"
              aria-label="Mes siguiente"
              onClick={() => setViewMonth((current) => addMonths(current, 1))}
            >
              →
            </button>
          </div>

          <div className="commission-date-picker__weekdays" aria-hidden="true">
            {WEEKDAY_LABELS.map((weekday, index) => (
              <span key={`${weekday}-${index}`}>{weekday}</span>
            ))}
          </div>

          <div className="commission-date-picker__grid">
            {buildCalendarDays(viewMonth).map((day) => {
              const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false;
              const isToday = isSameDay(day.date, today);
              return (
                <button
                  key={toIsoDate(day.date)}
                  type="button"
                  className={[
                    "commission-date-picker__day",
                    day.inCurrentMonth ? "" : "commission-date-picker__day--outside",
                    isSelected ? "commission-date-picker__day--selected" : "",
                    isToday ? "commission-date-picker__day--today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => selectDay(day.date)}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
