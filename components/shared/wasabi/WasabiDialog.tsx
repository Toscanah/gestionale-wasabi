import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Warning } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

const sizes = {
  small: "!max-w-[25vw] !w-[25vw]",
  medium: "!max-w-[40vw] !w-[40vw]",
  mediumPlus: "!max-w-[60vw] !w-[60vw]",
  large: "!max-w-[97.5vw] !w-[97.5vw]",
};

export type WasabiDialogProps = {
  modal?: boolean;
  putUpperBorder?: boolean;
  double?: boolean;
  autoFocus?: boolean;
  children?: ReactNode;
  trigger?: ReactNode | undefined;
  showCloseButton?: boolean;
  variant?: "delete" | "normal" | "warning";
  contentClassName?: string;
  triggerClassName?: string;
  footerClassName?: string;
  putSeparator?: boolean;
  open?: boolean;
  footer?: ReactNode;
  onDelete?: () => void;
  onOpenChange?: (open: boolean) => void;
  size?: keyof typeof sizes;
} & (
  | { title: ReactNode; desc?: ReactNode }
  | { title: ReactNode; desc: ReactNode }
  | { title?: never; desc?: never }
);

export default function WasabiDialog({
  putUpperBorder = false,
  double = false,
  children,
  putSeparator = false,
  title,
  trigger,
  showCloseButton = true,
  desc,
  variant = "normal",
  contentClassName,
  triggerClassName,
  open,
  autoFocus = true,
  footer,
  onDelete,
  onOpenChange,
  size = "medium",
  modal = true,
  footerClassName,
}: WasabiDialogProps) {
  // const [interactionReady, setInteractionReady] = useState(false);

  const isDeleteVariant = variant === "delete";
  const isWarningVariant = variant === "warning";

  const thisOnOpenChange = (open: boolean) => onOpenChange?.(open);

  // useEffect(() => {
  //   if (open && double) {
  //     setInteractionReady(false);
  //     const timeout = setTimeout(() => {
  //       setInteractionReady(true);

  //     }, 10000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [open, double]);

  // useEffect(() => {
  //   if (double) {
  //     console.log("Interaction ready:", interactionReady);
  //   }
  // }, [interactionReady]);

  return (
    <Dialog onOpenChange={thisOnOpenChange} open={open} modal={modal}>
      {trigger && (
        <DialogTrigger
          asChild
          className={cn("select-none", triggerClassName)}
          onClick={(e) => {
            if (double) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onDoubleClick={(e) => {
            thisOnOpenChange(true);
            e.stopPropagation();
          }}
        >
          {trigger}
        </DialogTrigger>
      )}

      <DialogContent
        onOpenAutoFocus={(e) => !autoFocus && e.preventDefault()}
        className={cn(
          "w-auto max-h-screen duration-75",
          sizes[size],
          isDeleteVariant && "border-t-4 border-t-red-600",
          isWarningVariant && "border-t-4 border-t-warning-500",
          putUpperBorder && "border-t-4 border-t-gray-400",
          // !interactionReady && "*:cursor-not-allowed", // add this
          contentClassName
        )}
        // style={{ pointerEvents: interactionReady ? "auto" : "none" }}
        showCloseButton={showCloseButton}
      >
        {(title || isDeleteVariant || isWarningVariant) && (
          <DialogHeader className="w-full">
            <DialogTitle className="text-2xl">
              {isDeleteVariant || isWarningVariant ? (
                <span className="flex gap-2 items-center">
                  <Warning size={32} />
                  Attenzione!
                </span>
              ) : (
                title
              )}
            </DialogTitle>
            {desc && <DialogDescription className="text-lg">{desc}</DialogDescription>}
          </DialogHeader>
        )}

        {!title && !(isDeleteVariant || isWarningVariant) && (
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only" />
          </DialogHeader>
        )}

        {(desc || putSeparator) && <Separator />}

        {children}

        {isDeleteVariant && onDelete && (
          <DialogFooter className={cn("w-full flex gap-4", footerClassName)}>
            <DialogClose asChild>
              <Button className="flex-1" variant={"outline"}>
                Ho cambiato idea
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button type="button" className="flex-1" variant={"destructive"} onClick={onDelete}>
                Confermo
              </Button>
            </DialogClose>
          </DialogFooter>
        )}

        {footer && <DialogFooter className="w-full flex gap-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
