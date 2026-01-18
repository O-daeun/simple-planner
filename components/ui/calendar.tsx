"use client";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import { DayPicker, type DayButton } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: "w-fit",
        months: "flex gap-4 flex-col md:flex-row relative",
        month: "flex flex-col w-full gap-4",
        nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none"
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none"
        ),
        month_caption:
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
        dropdowns:
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
        dropdown_root:
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
        dropdown: "absolute bg-popover inset-0 opacity-0",
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5"
        ),
        table: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
        week: "flex w-full mt-2",
        week_number_header: "select-none w-(--cell-size)",
        week_number: "text-[0.8rem] select-none text-muted-foreground",
        day: "relative w-full h-full p-0 text-center group/day aspect-square select-none",
        today:
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
        outside: "text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...props}
          />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeftIcon
              : orientation === "right"
                ? ChevronRightIcon
                : ChevronDownIcon;
          return <Icon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // 주의 첫 번째(월요일)와 마지막(일요일) 확인
  const dayOfWeek = day.date.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
  const isWeekStart = dayOfWeek === 1; // 월요일
  const isWeekEnd = dayOfWeek === 0; // 일요일

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected={modifiers.selected}
      data-week-selected={modifiers.weekSelected}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
        "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
        "data-[selected=true]:bg-primary!",
        "data-[week-selected=true]:bg-primary!",
        modifiers.weekSelected &&
          (isWeekStart
            ? "rounded-l-md rounded-r-none"
            : isWeekEnd
              ? "rounded-l-none rounded-r-md"
              : "rounded-none"),
        "dark:hover:text-accent-foreground",
        "[&>span]:text-xs [&>span]:opacity-70",
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
