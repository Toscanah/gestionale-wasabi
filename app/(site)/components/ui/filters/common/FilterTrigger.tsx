import { forwardRef, ElementType } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { XCircle, PlusCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FilterTriggerProps extends React.ComponentProps<typeof Button> {
  title: string;
  labels?: string[];
  onClear?: () => void;
  dashed?: boolean;
  triggerIcon?: ElementType; // Customizable PlusCircle icon
  disabled?: boolean;
}

const FilterTrigger = forwardRef<HTMLButtonElement, FilterTriggerProps>(
  (
    {
      title,
      labels = [],
      onClear,
      dashed = true,
      className,
      triggerIcon: TriggerIcon = PlusCircle,
      disabled,
      ...props
    },
    ref
  ) => {
    const parsedLabels = labels.filter(Boolean);
    const count = parsedLabels.length;

    return (
      <Button
        disabled={disabled}
        ref={ref}
        variant="outline"
        className={cn("h-10 flex gap-2 items-center px-2", dashed && "border-dashed", className)}
        {...props}
      >
        {count > 0 ? (
          <XCircle
            onClick={(e) => {
              e.stopPropagation();
              onClear?.();
            }}
            className="h-4 w-4"
          />
        ) : (
          <TriggerIcon className="h-4 w-4" />
        )}

        {title}

        {count > 0 && (
          <>
            <Separator orientation="vertical" className="mx-0.5" />
            {count > 1 && (
              <Badge variant="secondary" className="px-1 rounded-lg">
                {count}
              </Badge>
            )}
            <div className="flex items-center gap-1">
              {count > 2 ? (
                <Badge variant="secondary" className="px-1 rounded-lg">
                  {count} selezionati
                </Badge>
              ) : (
                parsedLabels.map((label) => (
                  <Badge variant="secondary" key={label} className="px-1 rounded-lg">
                    {label}
                  </Badge>
                ))
              )}
            </div>
          </>
        )}
      </Button>
    );
  }
);

FilterTrigger.displayName = "FilterTrigger";

export default FilterTrigger;
