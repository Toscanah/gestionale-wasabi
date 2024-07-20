import {
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useRef,
} from "react";
import { AnyOrder, PickupOrder } from "../../types/OrderType";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypesOfOrder } from "../../types/TypesOfOrder";

import { toast } from "sonner";
import WhenSelector from "../../components/WhenSelector";
import { useWasabiContext } from "../../orders/WasabiContext";

export default function PickUp({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
    nextRef: RefObject<HTMLInputElement | HTMLButtonElement> | null
  ) => {
    if (e.key === "Enter") {
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const createPickupOrder = () => {
    const name = nameRef.current?.value;
    const phone = phoneRef.current?.value ?? "";
    const when = selectRef.current?.innerText ?? "immediate";

    if (name === "") {
      toast.error("Errore", {
        description: <>L'ordine deve avere un nome di un cliente</>,
      });
      return;
    }

    fetch("/api/orders/", {
      method: "POST",
      body: JSON.stringify({
        requestType: "createPickupOrder",
        content: {
          name,
          when,
          phone,
        },
      }),
    })
      .then((response) => response.json())
      .then((order: PickupOrder) => {
        onOrdersUpdate(TypesOfOrder.PICK_UP);
        setOrder(order);
      });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full space-y-2">
        <Label htmlFor="name" className="text-xl">
          Nome cliente
        </Label>
        <Input
          type="text"
          id="name"
          className="w-full text-center text-6xl h-16"
          ref={nameRef}
          onKeyDown={(e) => handleKeyDown(e, phoneRef)}
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="phone" className="text-xl">
          Telefono (fac.)
        </Label>
        <Input
          type="number"
          id="phone"
          className="w-full text-center text-6xl h-16"
          ref={phoneRef}
          onKeyDown={(e) => handleKeyDown(e, selectRef)}
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="when" className="text-xl">
          Quando?
        </Label>
        <WhenSelector
          ref={selectRef}
          handleKeyDown={handleKeyDown}
          nextRef={null}
        />
      </div>

      <Button type="submit" className="w-full" onClick={createPickupOrder}>
        CREA ORDINE
      </Button>
    </div>
  );
}
