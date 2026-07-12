import * as React from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "./ui/utils";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

type Props = {
  dateFrom: string;
  dateTo: string;
  onChange: (from: string, to: string) => void;
};

export function DateRangeFilter({ dateFrom, dateTo, onChange }: Props) {
  const date: DateRange | undefined = React.useMemo(() => {
    if (!dateFrom && !dateTo) return undefined;
    return {
      from: dateFrom ? parseISO(dateFrom) : undefined,
      to: dateTo ? parseISO(dateTo) : undefined,
    };
  }, [dateFrom, dateTo]);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange('', '');
      return;
    }
    const fromStr = range.from ? format(range.from, 'yyyy-MM-dd') : '';
    const toStr = range.to ? format(range.to, 'yyyy-MM-dd') : '';
    onChange(fromStr, toStr);
  };

  const hasValue = !!(date?.from || date?.to);

  const label = date?.from
    ? date.to
      ? `${format(date.from, "MMM d")} – ${format(date.to, "MMM d, y")}`
      : format(date.from, "MMM d, y")
    : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs outline-none flex items-center justify-between gap-1.5 transition-colors hover:border-[var(--border-hover)]",
            hasValue ? "text-[var(--text-on-dark)]" : "text-[var(--text-placeholder)]"
          )}
        >
          <span className="flex items-center gap-1.5 min-w-0 truncate">
            <CalendarIcon
              className="w-3 h-3 shrink-0"
              style={{ color: hasValue ? 'var(--brand-blue)' : 'var(--text-faint)' }}
              strokeWidth={2}
            />
            <span className="truncate">{label ?? "Pick a date range"}</span>
          </span>
          {hasValue ? (
            <X
              className="w-3 h-3 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              strokeWidth={2.5}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange('', '');
              }}
            />
          ) : (
            <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-[var(--surface-elevated)] border border-[var(--border-on-dark-strong)] text-[var(--text-on-dark)] rounded-xl shadow-2xl"
        align="start"
        sideOffset={4}
      >
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
