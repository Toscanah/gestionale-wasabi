import { SortDirection } from "@/app/(site)/lib/shared/schemas/common/sorting";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

interface SortDirectionSelectorProps {
  direction: SortDirection;
  onDirectionChange: (updatedDirection: SortDirection) => void;
}

export default function SortDirectionSelector({
  direction,
  onDirectionChange,
}: SortDirectionSelectorProps) {
  const toggle = () => {
    onDirectionChange(direction === "asc" ? "desc" : "asc");
  };

  return (
    <Button variant="outline" onClick={toggle} className="flex items-center gap-2">
      <span>Grande</span>
      <ArrowRight
        className={`h-4 w-4 transition-transform duration-700 ease-in-out ${
          direction === "asc"
        ? ""
        : "rotate-[-540deg]"
        }`}
        style={{
          transitionProperty: "transform",
        }}
      />
      <span>Piccolo</span>
    </Button>
  );
}
