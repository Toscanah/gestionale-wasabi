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

interface DialogWrapperProps {
  children?: ReactNode;
  title?: string | ReactNode;
  trigger: ReactNode | JSX.Element;
  showCloseButton?: boolean;
  desc?: ReactNode;
  variant?: "delete" | "normal";
  contentClassName?: string;
  triggerClassName?: string;
  hasHeader?: boolean;
  open?: boolean;
  footer?: ReactNode;
  onDelete?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export default function DialogWrapper({
  children,
  title,
  trigger,
  showCloseButton = true,
  desc,
  variant = "normal",
  contentClassName,
  triggerClassName,
  hasHeader = false,
  open,
  footer,
  onDelete,
  onOpenChange,
}: DialogWrapperProps) {
  const isDeleteVariant = variant === "delete";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild className={triggerClassName}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-screen w-auto",
          contentClassName,
          isDeleteVariant && "border-t-4 border-t-red-600"
        )}
        showCloseButton={showCloseButton}
      >
        {hasHeader && (
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

            {desc && <DialogDescription>{desc}</DialogDescription>}
          </DialogHeader>
        )}

        {children}

        {isDeleteVariant && onDelete && (
          <DialogFooter className="w-full">
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button className="w-full" variant={"outline"}>
                  Indietro, ho cambiato idea
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

        {footer && <DialogFooter className="w-full">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
