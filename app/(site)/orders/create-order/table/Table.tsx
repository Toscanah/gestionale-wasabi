import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyOrder, TableOrder } from "../../../types/PrismaOrders";
import { useWasabiContext } from "../../../context/WasabiContext";
import { OrderType } from "@prisma/client";

import fetchRequest from "../../../util/functions/fetchRequest";
import { toastError, toastSuccess } from "../../../util/toast";
import { Triangle } from "react-loader-spinner";
import useFocusCycle from "@/app/(site)/components/hooks/useFocusCycle";

export default function Table({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const tableRef = useRef<HTMLInputElement>(null);
  const pplRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    addRefs(tableRef.current, pplRef.current, nameRef.current, buttonRef.current);
  }, []);

  const createTableOrder = () => {
    const people = Number(pplRef.current?.value);
    const table = tableRef.current?.value;
    const res_name = nameRef.current?.value;
    const content = { table, people, res_name };

    if (table == "") {
      return toastError("Assicurati di aver aggiunto un tavolo");
    }

    if (people < 1) {
      return toastError("Il tavolo deve avere almeno una persona");
    }

    fetchRequest<TableOrder>("POST", "/api/orders/", "createTableOrder", { ...content }).then(
      (order) => {
        if (order) {
          toastSuccess("Ordine creato con successo");
          setOrder(order);
          onOrdersUpdate(OrderType.TABLE);
        } else {
          toastError("L'ordine non è stato creato. Sei sicuro che il tavolo esista?");
        }
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full space-y-2">
        <Label htmlFor="table" className="text-xl">
          Tavolo*
        </Label>
        <Input
          autoFocus
          type="text"
          id="table"
          className="w-full text-center text-6xl h-16"
          ref={tableRef}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="ppl" className="text-xl">
          Numero persone*
        </Label>
        <Input
          type="number"
          id="ppl"
          className="w-full text-center text-6xl h-16"
          ref={pplRef}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="name" className="text-xl">
          Nome prenotazione
        </Label>
        <Input
          type="text"
          id="name"
          className="w-full text-center text-6xl h-16"
          ref={nameRef}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button ref={buttonRef} type="submit" className="w-full" onClick={createTableOrder}>
        CREA ORDINE
      </Button>
    </div>
  );
}
