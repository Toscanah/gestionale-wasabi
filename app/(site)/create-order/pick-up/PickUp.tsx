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
import { useOrderContext } from "../../orders/OrderContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function PickUp({
  setOrder,
}: {
  setOrder: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const { onOrdersUpdate } = useOrderContext();

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

    if (name == "") {
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
          name: name,
          when: selectRef.current?.innerText,
          phone: phone,
        },
      }),
    })
      .then((response) => response.json())
      .then((order: PickupOrder) => {
        onOrdersUpdate(TypesOfOrder.PICK_UP);
        setOrder(order);
      });
  };

  function generateTimeSlots(
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ) {
    const times = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute <= endMinute)
    ) {
      const timeString = `${String(currentHour).padStart(2, "0")}:${String(
        currentMinute
      ).padStart(2, "0")}`;
      times.push(timeString);

      currentMinute += 15;
      if (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }

    return times;
  }

  function getLunchTimes() {
    return generateTimeSlots(12, 0, 14, 30);
  }

  function getDinnerTimes() {
    return generateTimeSlots(18, 30, 22, 30);
  }

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
        <Select defaultValue="immediate">
          <SelectTrigger
            className="w-full text-3xl h-16"
            ref={selectRef}
            onKeyDown={(e) => handleKeyDown(e, null)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="immediate" className="text-xl" defaultChecked>
                Subito
              </SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel className="text-xl space-y-2">
                <Separator orientation="horizontal" />
                <div>Pranzo</div>
              </SelectLabel>
              {getLunchTimes().map((time: string) => (
                <SelectItem key={time} value={time} className="text-xl">
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>

            <SelectGroup>
              <SelectLabel className="text-xl space-y-2">
                <Separator orientation="horizontal" />
                <div>Cena</div>
              </SelectLabel>
              {getDinnerTimes().map((time: string) => (
                <SelectItem key={time} value={time} className="text-xl">
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full"
        onClick={() => {
          createPickupOrder();
        }}
      >
        CREA ORDINE
      </Button>
    </div>
  );
}
