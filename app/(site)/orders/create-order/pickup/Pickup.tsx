import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { AnyOrder, PickupOrder } from "../../../types/PrismaOrders";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderType } from "@prisma/client";
import { toast } from "sonner";
import WhenSelector from "../../../components/select/WhenSelector";
import { useWasabiContext } from "../../../context/WasabiContext";
import useFocusCycle from "../../../components/hooks/useFocusCycle";
import fetchRequest from "../../../util/functions/fetchRequest";
import { toastError } from "../../../util/toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Question } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

interface PickupProps {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
}

export default function Pickup({ setOrder }: PickupProps) {
  const { updateGlobalState } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => addRefs(nameRef.current, phoneRef.current, selectRef.current, buttonRef.current),
    []
  );

  const createPickupOrder = () => {
    const name = nameRef.current?.value;
    const phone = phoneRef.current?.value ?? "";
    const when = selectRef.current?.innerText;
    const content = { name, when, phone };

    if (name === "") {
      return toastError("L'ordine deve avere un nome di un cliente");
    }

    fetchRequest<PickupOrder>("POST", "/api/orders/", "createPickupOrder", { ...content }).then(
      (newPickupOrder) => {
        setOrder(newPickupOrder);
        updateGlobalState(newPickupOrder, "add");
      }
    );
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
          className="w-full text-center text-6xl h-16 uppercase"
          ref={nameRef}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="when" className="text-xl">
          Quando?
        </Label>
        <WhenSelector ref={selectRef} onKeyDown={handleKeyDown} />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="phone" className="text-xl flex justify-between items-center">
          <div>
            Telefono <span className="text-muted-foreground">(facoltativo)</span>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Question className="hover:scale-110" />
            </HoverCardTrigger>
            <HoverCardContent className="max-w-[400px] w-[400px]">
              <div className="space-y-2">
                <h4 className="text-sm font-bold flex gap-2 items-center">
                  {/* <Info size={24}/> */}
                  Nota bene:
                </h4>
                <Separator orientation="horizontal" />
                <ul className="text-sm list-disc ml-4 space-y-1">
                  <li>
                    Se viene inserito un numero di telefono, il programma controlla se esiste già un
                    cliente con questo numero:
                    <ul className="list-disc ml-4">
                      <li>Se esiste, utilizzerà il cognome del cliente esistente per l'ordine.</li>
                      <li>
                        Altrimenti, creerà un nuovo cliente con il numero di telefono inserito e
                        utilizzerà il nome.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Se non viene inserito un numero di telefono, il programma utilizzerà il nome
                    inserito per l'ordine.
                  </li>
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Label>

        <Input
          type="number"
          id="phone"
          className="w-full text-center text-6xl h-16 uppercase"
          ref={phoneRef}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button type="submit" className="w-full" onClick={createPickupOrder} ref={buttonRef}>
        CREA ORDINE
      </Button>
    </div>
  );
}
