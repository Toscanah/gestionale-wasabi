import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import OrderDeletionDialog from "@/domains/orders/single-order/overview/OrderDeletionDialog";
import { useOrderContext } from "@/context/OrderContext";
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
        size="medium"
        variant="delete"
        trigger={
          <Button
            className="w-1/2 h-12 text-xl bg-yellow-400"
            disabled={table.getFilteredSelectedRowModel().rows.length == 0}
          >
            Cancella prodotti selezionati
          </Button>
        }
        onDelete={() => deleteProducts(table, productsCooked)}
      >
        <div className="flex flex-col gap-4">
          <span className="text-lg">
            Stai per eliminare il/i prodotto/i che hai selezionato. Questa azione è finale e non
            reversibile.
          </span>

          <Label className="hover:bg-accent/50 text-lg flex items-center gap-4 rounded-lg border p-4 has-[[aria-checked=true]]:border-warning-600 has-[[aria-checked=true]]:bg-warning-50 ">
            <Checkbox
              id="toggle-2"
              checked={productsCooked}
              onCheckedChange={(e) => setProductsCooked(!!e)}
              className="data-[state=checked]:border-warning-500 data-[state=checked]:bg-warning-600 data-[state=checked]:text-white"
            />
            <p className="font-medium">Ho cucinato i prodotti di questo ordine</p>
          </Label>
        </div>
      </WasabiDialog>
    </div>
  );
}
