import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Warning } from "@phosphor-icons/react";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export default function DangerActions({
  deleteProducts,
  cancelOrder,
  table,
}: {
  deleteProducts: (table: Table<any>, cooked: boolean) => void;
  cancelOrder: (cooked: boolean) => void;
  table: Table<any>;
}) {
  const [productsCooked, setProductsCooked] = useState(false);

  useEffect(() => setProductsCooked(false), []);

  return (
    <div className="w-full flex gap-6 items-center h-12">
      <DialogWrapper
        contentClassName="max-w-[40vw]"
        variant="delete"
        hasHeader
        trigger={
          <Button className="w-full h-12 text-xl" variant={"destructive"}>
            Elimina ordine
          </Button>
        }
        onDelete={() => cancelOrder(productsCooked)}
      >
        <div className="space-y-2">
          <span className="text-lg">
            Stai per eliminare questo ordine. Questa azione è finale e non reversibile.
          </span>

          <div className="flex gap-2 items-center">
            <Label className="text-lg font-normal">Ho cucinato i prodotti di questo ordine</Label>
            <Checkbox
              checked={productsCooked}
              onCheckedChange={(e: any) => setProductsCooked(e as boolean)}
            />
          </div>
        </div>
      </DialogWrapper>

      <DialogWrapper
        contentClassName="max-w-[40vw]"
        title="Attenzione"
        variant="delete"
        hasHeader
        trigger={
          <Button
            className="w-full h-12 text-xl"
            variant={"destructive"}
            disabled={table.getFilteredSelectedRowModel().rows.length == 0}
          >
            Cancella prodotti selezionati
          </Button>
        }
        onDelete={() => deleteProducts(table, productsCooked)}
      >
        <div className="space-y-2">
          <span className="text-lg">
            Stai per eliminare il/i prodotto/i che hai selezionato. Questa azione è finale e non
            reversibile.
          </span>

          <div className="flex gap-2 items-center">
            <Label className="text-lg font-normal">Ho cucinato questo/i prodotto/i</Label>
            <Checkbox
              checked={productsCooked}
              onCheckedChange={(e: any) => setProductsCooked(e as boolean)}
            />
          </div>
        </div>
      </DialogWrapper>
    </div>
  );
}
