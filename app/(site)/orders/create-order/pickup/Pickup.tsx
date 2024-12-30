import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AnyOrder, PickupOrder } from "@/app/(site)/models";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WhenSelector from "../../../components/select/WhenSelector";
import { useWasabiContext } from "../../../context/WasabiContext";
import useFocusCycle from "../../../components/hooks/useFocusCycle";
import fetchRequest from "../../../functions/api/fetchRequest";
import { toastError } from "../../../functions/util/toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Question } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

interface PickupProps {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
}

export default function Pickup({ setOrder }: PickupProps) {
  const { updateGlobalState } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [when, setWhen] = useState<string>("immediate");

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => addRefs(nameRef.current, selectRef.current, phoneRef.current, buttonRef.current),
    []
  );

  const createPickupOrder = () => {
    if (name === "") {
      return toastError("L'ordine deve avere un nome di un cliente");
    }

    const content = { name, when, phone };

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="when" className="text-xl">
          Quando?
        </Label>
        <WhenSelector
          ref={selectRef}
          value={when}
          onValueChange={(value) => setWhen(value)}
          onKeyDown={handleKeyDown}
        />
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
                <h4 className="text-sm font-bold flex gap-2 items-center">Nota bene:</h4>
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button type="submit" className="w-full" onClick={createPickupOrder} ref={buttonRef}>
        CREA ORDINE
      </Button>
    </div>
  );
}
