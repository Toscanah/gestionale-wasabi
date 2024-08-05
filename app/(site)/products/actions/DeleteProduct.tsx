import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "@phosphor-icons/react";
import fetchRequest from "../../util/functions/fetchRequest";
import { toast } from "sonner";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DeleteProduct({
  product,
  onDelete,
}: {
  product: ProductWithInfo;
  onDelete: (deletedProduct: ProductWithInfo) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash size={24} className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-screen w-[25vw]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-8">
          <DialogTitle>Attenzione!</DialogTitle>
          <div>
            Stai per eliminare il prodotto <b>{product.name}</b>. Sei sicuro?
          </div>

          <DialogFooter className="w-full flex gap-2">
            <DialogClose asChild>
              <Button className="w-full" variant={"outline"}>
                Indietro
              </Button>
            </DialogClose>

            <Button type="submit" className="w-full" variant={"destructive"}>
              Elimina
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
