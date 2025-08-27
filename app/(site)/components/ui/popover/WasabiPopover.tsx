import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WasabiPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export default function WasabiPopover({ trigger, children, contentClassName }: WasabiPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className={`w-full ${contentClassName}`}>{children}</PopoverContent>
    </Popover>
  );
}
