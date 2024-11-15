import { useState } from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";

export function DatePicker({
  selected,
  onSelect,
  children,
}: {
  selected?: Date;
  onSelect?: (date: Date) => void;
  children: React.ReactNode;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOnSelect: SelectSingleEventHandler = (date) => {
    onSelect?.(date!);
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 10}
          toDate={new Date()}
          selected={selected}
          onSelect={handleOnSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
