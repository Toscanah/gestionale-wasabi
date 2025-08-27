import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
}

export default function ResetFiltersButton({ onReset, className }: ResetButtonProps) {
  return (
    <Button onClick={onReset} variant={"outline"} className={cn("border-dashed h-8", className)}>
      <ArrowCounterClockwise className="h-4 w-4 mr-2" /> Reset filtri
    </Button>
  );
}
