import {
  useRef,
  KeyboardEvent,
  RefObject,
  Dispatch,
  SetStateAction,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyOrder, TableOrder } from "../../types/OrderType";
import { useWasabiContext } from "../../orders/WasabiContext";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import { toast } from "sonner";

export default function Table({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();

  const tableRef = useRef<HTMLInputElement>(null);
  const pplRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    nextRef: RefObject<HTMLInputElement> | null
  ) => {
    if (e.key === "Enter") {
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  const createTableOrder = () => {
    const ppl = Number(pplRef.current?.value);
    const table = tableRef.current?.value;

    if (table == "") {
      toast.error("Errore", {
        description: <>Assicurati di aver aggiunto un tavolo</>,
      });
      return;
    }
    if (ppl < 1) {
      toast.error("Errore", {
        description: <>Il tavolo deve avere almeno una persona</>,
      });
      return;
    }


    fetch("/api/orders/", {
      method: "POST",
      body: JSON.stringify({
        requestType: "createTableOrder",
        content: {
          table: table,
          people: ppl,
          res_name: nameRef.current?.value,
        },
      }),
    })
      .then((response) => response.json())
      .then((order: TableOrder) => {
        if (order) {
          onOrdersUpdate(TypesOfOrder.TABLE);
          setOrder(order);
        } else {
          toast.error("Qualcuno è andato storto...", {
            description: (
              <>L'ordine non è stato creato. Sei sicuro che il tavolo esista?</>
            ),
          });
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
          onKeyDown={(e) => handleKeyDown(e, pplRef)}
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
          onKeyDown={(e) => handleKeyDown(e, nameRef)}
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
          onKeyDown={(e) => handleKeyDown(e, null)}
        />
      </div>

      <Button
        ref={buttonRef}
        type="submit"
        className="w-full"
        onClick={() => {
          createTableOrder();
        }}
      >
        CREA ORDINE
      </Button>
    </div>
  );
}
