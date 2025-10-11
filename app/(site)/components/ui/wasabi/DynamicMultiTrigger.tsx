import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState, ElementType } from "react";

interface DynamicMultiTriggerProps {
  placeholder?: string;
  selectedOptions: { label: string }[];
  isMulti: boolean;
  triggerClassName?: string;
  TriggerIcon?: ElementType;
  isOpen: boolean;
  disabled?: boolean;
}

function DynamicMultiTrigger({
  placeholder = "Seleziona...",
  selectedOptions,
  isMulti,
  triggerClassName,
  TriggerIcon,
  isOpen,
  disabled,
}: DynamicMultiTriggerProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  // Measure width and decide how many labels fit
  useEffect(() => {
    if (!isMulti || !ref.current) return;

    const button = ref.current;
    const observer = new ResizeObserver(() => {
      const width = button.offsetWidth;
      // Estimate: ~8px per character + padding, flexible
      const avgCharWidth = 8;
      const availableChars = Math.floor(width / avgCharWidth);

      // Approximate joined string length
      const labels = selectedOptions.map((o) => o.label);
      let visible: string[] = [];
      let totalLength = 0;
      for (const label of labels) {
        const next = visible.concat(label).join(", ");
        if (next.length > availableChars) break;
        visible.push(label);
        totalLength = next.length;
      }

      setVisibleCount(visible.length);
    });

    observer.observe(button);
    return () => observer.disconnect();
  }, [isMulti, selectedOptions]);

  const labels = selectedOptions.map((o) => o.label);

  const renderText = () => {
    if (!isMulti) return labels[0] ?? placeholder;
    if (labels.length === 0) return <span className="text-muted-foreground">{placeholder}</span>;

    if (visibleCount === null || visibleCount >= labels.length) {
      return <span className="truncate">{labels.join(", ")}</span>;
    }

    const visible = labels.slice(0, visibleCount);
    const remaining = labels.length - visibleCount;
    return (
      <span className="truncate">
        {visible.join(", ")}, +{remaining} altri...
      </span>
    );
  };

  return (
    <Button
      ref={ref}
      variant="outline"
      role="combobox"
      aria-expanded={isOpen}
      disabled={disabled}
      className={cn(
        "justify-between w-full text-sm overflow-hidden whitespace-nowrap",
        triggerClassName
      )}
    >
      {renderText()}
      {TriggerIcon ? <TriggerIcon className="ml-2 h-4 w-4 opacity-60 flex-shrink-0" /> : null}
    </Button>
  );
}
