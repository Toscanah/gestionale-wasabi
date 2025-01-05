import { useRef, useState, useEffect, Dispatch, SetStateAction, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyOrder, TableOrder } from "@/app/(site)/models";
import { useWasabiContext } from "../../../context/WasabiContext";
import fetchRequest from "../../../functions/api/fetchRequest";
import { toastError, toastSuccess } from "../../../functions/util/toast";
import useFocusCycle from "@/app/(site)/components/hooks/useFocusCycle";
import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import { cn } from "@/lib/utils";
import { OrderProvider } from "@/app/(site)/context/OrderContext";
import OrderTable from "../../single-order/OrderTable";
import generateEmptyOrder from "@/app/(site)/functions/order-management/generateEmptyOrder";
import { OrderType } from "@prisma/client";

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

  const tableRef = useRef<HTMLInputElement>(null);
  const pplRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => addRefs(tableRef.current, pplRef.current, nameRef.current, buttonRef.current),
    []
  );

  const createTableOrder = () => {
    setOrder(generateEmptyOrder(OrderType.TABLE));

    if (table == "") {
      return toastError("Assicurati di aver inserito un tavolo");
    }

    const content = { table, people: people ?? 1, resName };

    fetchRequest<{ order: TableOrder; new: boolean }>("POST", "/api/orders/", "createTableOrder", {
      ...content,
    }).then((newTableOrder) => {
      if (newTableOrder.new) {
        toastSuccess("Ordine creato con successo");
        updateGlobalState(newTableOrder.order, "add");
      }

      setOrder(newTableOrder.order);
      setOpen(true);
      setTable("");
    });
  };

  return (
    <div className="w-full h-full flex items-center pr-4 pb-4 gap-4">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <Input
            placeholder="Nome tavolo"
            type="text"
            id="table"
            className="w-full text-center text-lg rounded-none border-foreground focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
            ref={tableRef}
            value={table}
            onChange={(e) => setTable(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="w-full space-y-2">
          <Input
            placeholder="Numero persone"
            type="number"
            id="ppl"
            className="w-full text-center text-lg rounded-none border-foreground focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
            ref={pplRef}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <Button
        ref={buttonRef}
        type="submit"
        className="rounded-none text-3xl h-full w-52"
        onClick={createTableOrder}
      >
        Vai {children}
      </Button>

      <DialogWrapper
        size="large"
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setTimeout(() => {
            tableRef.current?.focus();
            tableRef.current?.select();
          }, 1);
        }}
        contentClassName="flex flex-col gap-6 items-center max-w-screen max-h-screen h-[95vh]"
      >
        <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen}>
          <OrderTable />
        </OrderProvider>
      </DialogWrapper>
    </div>
  );
}
