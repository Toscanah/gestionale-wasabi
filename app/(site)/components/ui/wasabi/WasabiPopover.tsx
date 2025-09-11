import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WasabiPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  modal?: boolean;
}

export default function WasabiPopover({ trigger, children, contentClassName, modal = true }: WasabiPopoverProps) {
  return (
    <Popover modal={modal}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={`w-full ${contentClassName}`}>{children}</PopoverContent>
    </Popover>
  );
}
