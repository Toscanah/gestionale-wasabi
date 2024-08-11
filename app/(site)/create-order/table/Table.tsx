import {
  useRef,
  KeyboardEvent,
  RefObject,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyOrder, TableOrder } from "../../types/PrismaOrders";
import { useWasabiContext } from "../../context/WasabiContext";
import { OrderType } from "../../types/OrderType";
import { toast } from "sonner";
import { useFocusCycle } from "../../components/hooks/useFocusCycle";
import fetchRequest from "../../util/functions/fetchRequest";
import { toastError, toastSuccess } from "../../util/toast";
import { Table as PrismaTable } from "@prisma/client";

export default function Table({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const [tables, setTables] = useState<PrismaTable[]>([]);
  const { onOrdersUpdate } = useWasabiContext();

  const tableRef = useRef<HTMLInputElement>(null);
  const pplRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { handleKeyDown } = useFocusCycle([
    tableRef,
    pplRef,
    nameRef,
    buttonRef,
  ]);

  useEffect(() => {
    fetchRequest<PrismaTable[]>("GET", "/api/tables/", "getTables").then(
      (tables) => setTables(tables)
    );
  }, []);

  const createTableOrder = () => {
    const ppl = Number(pplRef.current?.value);
    const table = tableRef.current?.value;

    if (table == "") {
      return toastError("Assicurati di aver aggiunto un tavolo");
    }

    if (!tables.some((t) => t.number === table)) {
      return toastError("Il tavolo specificato non esiste");
    }

    if (ppl < 1) {
      return toastError("Il tavolo deve avere almeno una persona");
    }

    fetchRequest<TableOrder>("POST", "/api/orders/", "createTableOrder", {
      table: table,
      people: ppl,
      res_name: nameRef.current?.value,
    }).then((order) => {
      if (order) {
        toastSuccess("Ordine creato con successo", "Successo");
        setOrder(order);
        onOrdersUpdate(OrderType.TABLE);
      } else {
        toastError(
          "L'ordine non è stato creato. Sei sicuro che il tavolo esista?"
        );
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full space-y-2">
        <Label htmlFor="table" className="text-xl">
          Tavolo*
        </Label>
        <Input
          type="text"
          id="table"
          className="w-full text-center text-6xl h-16"
          ref={tableRef}
          onKeyDown={(e) => handleKeyDown(e)}
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
          onKeyDown={(e) => handleKeyDown(e)}
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
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>

      <Button
        ref={buttonRef}
        type="submit"
        className="w-full"
        //onKeyDown={(e) => handleKeyDown(e)}
        onClick={() => {
          createTableOrder();
        }}
      >
        CREA ORDINE
      </Button>
    </div>
  );
}
