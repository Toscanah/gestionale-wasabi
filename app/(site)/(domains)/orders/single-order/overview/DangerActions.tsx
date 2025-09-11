import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import OrderDeletionDialog from "@/app/(site)/(domains)/orders/single-order/overview/OrderDeletionDialog";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface DangerActionsProps {
  table: Table<any>;
}

export default function DangerActions({ table }: DangerActionsProps) {
  const { cancelOrder, deleteProducts, toggleDialog } = useOrderContext();
  const [productsCooked, setProductsCooked] = useState(false);

  useEffect(() => setProductsCooked(false), []);

  return (
    <div className="w-full flex gap-6 items-center h-12">
      <OrderDeletionDialog
        type="single"
        onDelete={async (productsCooked: boolean) =>
          await cancelOrder(productsCooked).then(() => toggleDialog(false))
        }
      />

      <WasabiDialog
        size="small"
        variant="delete"
        trigger={
          <Button
            className="w-1/2 h-12 text-xl"
            variant={"warnining"}
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
      </WasabiDialog>
    </div>
  );
}
