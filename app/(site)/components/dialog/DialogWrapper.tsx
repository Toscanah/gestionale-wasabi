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

interface DialogWrapperProps {
  children?: ReactNode;
  title?: string | ReactNode;
  trigger: ReactNode | JSX.Element;
  showCloseButton?: boolean;
  desc?: ReactNode;
  variant?: "delete" | "normal";
  onDelete?: () => void;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
  triggerClassName?: string;
  hasHeader?: boolean;
  open?: boolean;
  footer?: ReactNode;
}

export default function DialogWrapper({
  children,
  title = "Titolo!!!!!",
  trigger,
  showCloseButton = true,
  desc,
  variant = "normal",
  onDelete,
  onOpenChange,
  contentClassName,
  triggerClassName,
  hasHeader = true,
  open,
  footer,
}: DialogWrapperProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild className={triggerClassName}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className={cn("max-w-screen w-auto", contentClassName)}
        showCloseButton={showCloseButton}
      >
        {hasHeader && (
          <DialogHeader>
            <DialogTitle className="mb-4">{title}</DialogTitle>
            {desc && <DialogDescription>{desc}</DialogDescription>}
          </DialogHeader>
        )}

        {children}

        {variant == "delete" && onDelete && (
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

        {footer && <DialogFooter className="w-full">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
