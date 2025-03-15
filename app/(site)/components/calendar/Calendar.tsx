import { Button } from "@/components/ui/button";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

type CalendarProps = {
  date: Date | undefined;
  handleDateSelect: (newDate: Date | undefined) => void;
};

export default function Calendar({ date, handleDateSelect }: CalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: it }) : "Seleziona una data"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <div className="rounded-md border">
          <ShadCalendar
            locale={it}
            mode={"single"}
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border shadow"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
