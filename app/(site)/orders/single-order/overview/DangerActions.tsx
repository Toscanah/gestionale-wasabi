import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";

export default function DangerActions({
  deleteProducts,
  cancelOrder,
  table,
}: {
  deleteProducts: () => void;
  cancelOrder: () => void;
  table: Table<any>;
}) {
  return (
    <div className="w-full flex gap-6 items-center h-12">
      <DialogWrapper
        title="Sei sicuro?"
        variant="delete"
        trigger={
          <Button className="w-full h-12 text-xl" variant={"destructive"}>
            Elimina ordine
          </Button>
        }
        onDelete={() => cancelOrder()}
      >
        <div>Stai per eliminare questo ordine</div>
      </DialogWrapper>

      <Button
        className="w-full h-12 text-xl"
        variant={"destructive"}
        onClick={() => deleteProducts()}
        disabled={table.getFilteredSelectedRowModel().rows.length == 0}
      >
        Cancella prodotti selezionati
      </Button>
    </div>
  );
}
