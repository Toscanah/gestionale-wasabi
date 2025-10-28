import { useState, Dispatch, SetStateAction, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderByType } from "@/app/(site)/lib/shared";
import { useWasabiContext } from "../../../../context/WasabiContext";
import { toastError, toastSuccess } from "../../../../lib/utils/global/toast";
import useFocusCycle from "@/app/(site)/hooks/focus/useFocusCycle";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { cn } from "@/lib/utils";
import { OrderProvider } from "@/app/(site)/context/OrderContext";
import OrderTable from "../../single-order/OrderTable";
import { PlusIcon } from "@phosphor-icons/react";
import { trpc } from "@/lib/server/client";

interface TableProps {
  setOrder: Dispatch<SetStateAction<OrderByType>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  order: OrderByType;
  children: ReactNode;
}

export default function Table({ setOrder, open, setOpen, order, children }: TableProps) {
  const { updateGlobalState } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const [table, setTable] = useState<string>("");
  const [people, setPeople] = useState<number | undefined>(undefined);
  const [resName, setResName] = useState<string>("");

  const createTableMutation = trpc.orders.createTable.useMutation({
    onSuccess: (tableOrder) => {
      if (tableOrder.isNewOrder) {
        toastSuccess("Ordine creato con successo");
        updateGlobalState(tableOrder.order, "add");
      }
      setOrder(tableOrder.order);
    },
    onError: () => {
      toastError("Errore nella creazione dell'ordine");
    },
  });

  const createTableOrder = () => {
    if (table == "") {
      return toastError("Assicurati di aver inserito un tavolo");
    }

    const content = { table, people: people || 1, resName };
    createTableMutation.mutate(content);
  };

  return (
    <WasabiDialog
      putSeparator
      putUpperBorder
      title={order.id !== -1 ? "" : "Ordine al tavolo"}
      size={order.id !== -1 ? "large" : "medium"}
      open={open}
      trigger={
        <div className="w-full pr-4 pb-4">
          <Button className="w-full text-3xl h-24 rounded-none">
            Tavolo {children}
          </Button>
        </div>
      }
      onOpenChange={() => {
        setTable("");
        setPeople(undefined);
        setResName("");

        setOpen(!open);
      }}
      contentClassName={cn(
        "flex flex-col gap-6 items-center max-w-screen max-h-screen",
        order.id !== -1 && "h-[95vh]"
      )}
    >
      {order.id == -1 ? (
        <>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="table" className="text-xl">
                Nome tavolo
              </Label>
              <Input
                type="text"
                id="table"
                className="w-full text-center !text-6xl h-16 uppercase focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                ref={(tableRef) => {
                  addRefs(tableRef);
                }}
                defaultValue={table}
                onChange={(e) => setTable(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="ppl" className="text-xl">
                Numero persone
              </Label>
              <Input
                type="number"
                id="ppl"
                className="w-full text-center !text-6xl h-16 uppercase focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                ref={(pplRef) => {
                  addRefs(pplRef);
                }}
                defaultValue={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <Button
            ref={(buttonRef) => addRefs(buttonRef)}
            type="submit"
            className="w-full"
            onClick={createTableOrder}
          >
            CREA ORDINE
          </Button>
        </>
      ) : (
        <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen}>
          <OrderTable />
        </OrderProvider>
      )}
    </WasabiDialog>
  );
}
