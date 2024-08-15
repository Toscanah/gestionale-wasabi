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
  children: ReactNode;
  title?: string;
  trigger: ReactNode | JSX.Element;
  showCloseButton?: boolean;
  desc?: ReactNode;
  variant?: "delete" | "normal";
  onDelete?: () => void;
  onOpenChange?: () => void;
  contentClassName?: string;
  header?: boolean;
}

export default function DialogWrapper({
  children,
  title = "",
  trigger,
  showCloseButton = true,
  desc,
  variant = "normal",
  onDelete,
  onOpenChange,
  contentClassName,
  header = true,
}: DialogWrapperProps) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("max-w-screen max-h-screen w-auto", contentClassName)}
        showCloseButton={showCloseButton}
      >
        {header && (
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

              <Button type="button" className="w-full" variant={"destructive"} onClick={onDelete}>
                Confermo
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
