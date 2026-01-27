import { forwardRef, ElementType } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { XCircle, PlusCircle, XCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FilterTriggerProps {
  title: string;
  values?: string[];
  onClear?: () => void;
  dashed?: boolean;
  triggerIcon?: ElementType;
  disabled?: boolean;
  className?: string;
}

const FilterTrigger = forwardRef<HTMLButtonElement, FilterTriggerProps>(
  (
    {
      title,
      values = [],
      onClear,
      dashed = true,
      className,
      triggerIcon: TriggerIcon = PlusCircle,
      disabled,
      ...props
    },
    ref
  ) => {
    const parsedValues = values.filter(Boolean);
    const valuesCount = parsedValues.length;

    return (
      <Button
        disabled={disabled}
        ref={ref}
        variant="outline"
        className={cn(
          "flex gap-2 items-center px-2",
          dashed && "border-dashed",
          disabled && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        {valuesCount > 0 && onClear ? (
          <span
            role="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear?.();
            }}
            className="flex items-center justify-center hover:cursor-pointer "
          >
            <XCircleIcon className="h-4 w-4" />
          </span>
        ) : (
          <TriggerIcon className="h-4 w-4" />
        )}

        {title}

        {valuesCount > 0 && (
          <>
            <Separator orientation="vertical" className="mx-0.5" />
            {/* {count > 1 && (
              <Badge variant="secondary" className="px-1 rounded-lg">
                {count}
              </Badge>
            )} */}
            <div className="flex items-center gap-2">
              {valuesCount > 2 ? (
                <Badge variant="secondary" className="px-1 rounded-lg">
                  {valuesCount} attivi
                </Badge>
              ) : (
                parsedValues.map((label) => (
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
