import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";

interface WasabiPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const WasabiPopover = React.forwardRef<React.ElementRef<typeof PopoverTrigger>, WasabiPopoverProps>(
  ({ trigger, children, contentClassName, modal = true, open, onOpenChange }, ref) => {
    return (
      <Popover modal={modal} open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild ref={ref}>
          {trigger}
        </PopoverTrigger>
        <PopoverContent className={`w-full ${contentClassName}`}>{children}</PopoverContent>
      </Popover>
    );
  }
);

WasabiPopover.displayName = "WasabiPopover";

export default WasabiPopover;
