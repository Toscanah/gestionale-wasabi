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
  small: "max-w-[25vw] w-[25vw]",
  medium: "max-w-[40vw] w-[40vw]",
  large: "max-w-[97.5vw] w-[97.5vw]",
};

type DialogWrapperProps = {
  double?: boolean;
  autoFocus?: boolean;
  children?: ReactNode;
  trigger?: ReactNode | undefined;
  showCloseButton?: boolean;
  variant?: "delete" | "normal";
  contentClassName?: string;
  triggerClassName?: string;
  open?: boolean;
  footer?: ReactNode;
  onDelete?: () => void;
  onOpenChange?: (open: boolean) => void;
  size?: keyof typeof sizes;
  tooltip?: ReactNode;
} & (
  | { title: ReactNode; desc?: ReactNode }
  | { title: ReactNode; desc: ReactNode }
  | { title?: never; desc?: never }
);

interface DialogTriggerWrapperProps {
  trigger: React.ReactNode;
  triggerClassName?: string;
  double?: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function DialogWrapper({
  double = false,
  children,
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
  tooltip,
}: DialogWrapperProps) {
  const isDeleteVariant = variant === "delete";

  const thisOnOpenChange = (open: boolean) => onOpenChange?.(open);

  return (
    <Dialog onOpenChange={thisOnOpenChange} open={open}>
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
          "w-auto max-h-screen",
          sizes[size],
          isDeleteVariant && "border-t-4 border-t-red-600",
          contentClassName
        )}
        showCloseButton={showCloseButton}
      >
        {(title || isDeleteVariant) && (
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isDeleteVariant ? (
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

        {desc && <Separator />}

        {children}

        {isDeleteVariant && onDelete && (
          <DialogFooter className="w-full">
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button className="w-full" variant={"outline"}>
                  Ho cambiato idea
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button type="button" className="w-full" variant={"destructive"} onClick={onDelete}>
                  Confermo
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        )}

        {footer && <DialogFooter className="w-full sm:space-x-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
