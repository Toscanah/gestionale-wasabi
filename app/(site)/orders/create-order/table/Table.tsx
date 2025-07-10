import { useRef, useState, useEffect, Dispatch, SetStateAction, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyOrder, TableOrder } from "@/app/(site)/lib/shared";
import { useWasabiContext } from "../../../context/WasabiContext";
import fetchRequest from "../../../lib/core/fetchRequest";
import { toastError, toastSuccess } from "../../../lib/utils/toast";
import useFocusCycle from "@/app/(site)/hooks/useFocusCycle";
import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import { cn } from "@/lib/utils";
import { OrderProvider } from "@/app/(site)/context/OrderContext";
import OrderTable from "../../single-order/OrderTable";
import generateEmptyOrder from "@/app/(site)/lib/services/order-management/generateEmptyOrder";
import { OrderType } from "@prisma/client";
import { Plus } from "@phosphor-icons/react";

interface TableProps {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  order: AnyOrder;
  children: ReactNode;
}

export default function Table({ setOrder, open, setOpen, order, children }: TableProps) {
  const { updateGlobalState } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const [table, setTable] = useState<string>("");
  const [people, setPeople] = useState<number | undefined>(undefined);
  const [resName, setResName] = useState<string>("");

  // const tableRef = useRef<HTMLInputElement>(null);
  // const pplRef = useRef<HTMLInputElement>(null);
  // const nameRef = useRef<HTMLInputElement>(null);
  // const buttonRef = useRef<HTMLButtonElement>(null);

  const createTableOrder = () => {
    if (table == "") {
      return toastError("Assicurati di aver inserito un tavolo");
    }

    const content = { table, people: people || 1, resName };

    fetchRequest<{ order: TableOrder; isNewOrder: boolean }>(
      "POST",
      "/api/orders/",
      "createTableOrder",
      {
        ...content,
      }
    ).then((tableOrder) => {
      if (tableOrder.isNewOrder) {
        toastSuccess("Ordine creato con successo");
        updateGlobalState(tableOrder.order, "add");
      }

      setOrder(tableOrder.order);
    });
  };

  return (
    <DialogWrapper
      size={order.id !== -1 ? "large" : "medium"}
      open={open}
      trigger={
        <div className="w-full pr-4 pb-4">
          <Button className="w-full text-3xl h-24 rounded-none">
            <Plus className="mr-2 h-5 w-5" /> Ordine al tavolo {children}
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
                // placeholder="Nome tavolo"
                type="text"
                id="table"
                className="w-full text-center text-6xl h-16 uppercase focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                ref={(tableRef) => {
                  // if (tableRef) {
                  //   tableRef.value = "";
                  // }
                  addRefs(tableRef);
                }}
                value={table}
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
                // placeholder="N° persone"
                type="number"
                id="ppl"
                className="w-full text-center text-6xl h-16 uppercase focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                ref={(pplRef) => {
                  // if (pplRef) {
                  //   pplRef.value = "";
                  // }
                  addRefs(pplRef);
                }}
                value={people}
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
            Vai {children}
          </Button>
        </>
      ) : (
        <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen}>
          <OrderTable />
        </OrderProvider>
      )}
    </DialogWrapper>
  );
}
