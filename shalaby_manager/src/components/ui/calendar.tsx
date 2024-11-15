import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, type DropdownProps } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { ny } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useTranslation } from "react-i18next";
import { enGB, ar } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation();
  const language = i18n.language;
  return (
    <DayPicker
      locale={language === "ar" ? ar : enGB}
      showOutsideDays={showOutsideDays}
      className={ny("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 font-semibold",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button: ny(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
        row: "flex w-full gap-1 mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: ny(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal font-semibold aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary hover:bg-primary/80 text-primary-foreground focus:bg-primary/80",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        vhidden: "hidden",
        caption_dropdowns: "flex gap-1 px-8",
        dropdown: "flex space-x-1",
        dropdown_year: "w-16",
        dropdown_month: "w-16",
        ...classNames,
      }}
      components={{
        IconLeft: ({}) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({}) => <ChevronRight className="h-4 w-4" />,
        Dropdown: ({
          onChange,
          value,
          caption,
          children,
          "aria-label": ariaLabel,
          ...props
        }: DropdownProps) => {
          const options = React.Children.toArray(
            children
          ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];

          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };

          return (
            <Select
              value={value?.toString()}
              onValueChange={handleChange}
              {...props}
            >
              <SelectTrigger
                className="h-7 text-xs text-foreground/70"
                aria-label={ariaLabel}
              >
                <SelectValue placeholder={caption} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="max-h-60 overflow-auto">
                  {options.map((option) => {
                    return (
                      <SelectItem
                        key={option.key}
                        value={option.props.value?.toString() ?? ""}
                      >
                        {option.props.children}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
