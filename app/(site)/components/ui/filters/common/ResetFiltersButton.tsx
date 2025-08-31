import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
  show: boolean;
}

export default function ResetFiltersButton({ onReset, className, show }: ResetButtonProps) {
  if (!show) return <> </>;

  return (
    <Button
      onClick={onReset}
      variant={"outline"}
      className={cn("ml-auto border-dashed h-10", className)}
    >
      <ArrowCounterClockwise className="h-4 w-4 mr-2" /> Reset filtri
    </Button>
  );
}
