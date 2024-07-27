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
import { useFocusCycle } from "../../components/hooks/useFocusCycle";
import fetchRequest from "../../util/fetchRequest";

export default function PickUp({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);

  const { handleKeyDown } = useFocusCycle([nameRef, phoneRef, selectRef]);

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

    fetchRequest<PickupOrder>("POST", "/api/orders/", "createPickupOrder", {
      name,
      when,
      phone,
    }).then((order) => {
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
          onKeyDown={(e) => handleKeyDown(e)}
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
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="when" className="text-xl">
          Quando?
        </Label>
        <WhenSelector ref={selectRef} handleKeyDown={handleKeyDown} />
      </div>

      <Button type="submit" className="w-full" onClick={createPickupOrder}>
        CREA ORDINE
      </Button>
    </div>
  );
}
