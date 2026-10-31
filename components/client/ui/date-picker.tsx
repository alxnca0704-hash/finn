"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";

import { Button } from "@/components/client/ui/button";
import { Calendar } from "@/components/client/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/client/ui/popover";
import { cn } from "@/lib/utils";

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>();
  const date = value ?? internalDate;

  function handleSelect(next: Date | undefined) {
    if (value === undefined) {
      setInternalDate(next);
    }
    onChange?.(next);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarDaysIcon />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
