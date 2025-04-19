import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { AnyOrder, PickupOrder } from "@shared"
;
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WhenSelector from "../../../components/ui/time/WhenSelector";
import { useWasabiContext } from "../../../context/WasabiContext";
import useFocusCycle from "../../../hooks/useFocusCycle";
import fetchRequest from "../../../lib/api/fetchRequest";
import { toastError, toastSuccess } from "../../../lib/util/toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Plus, Question } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import { OrderProvider } from "@/app/(site)/context/OrderContext";
import OrderTable from "../../single-order/OrderTable";
import { cn } from "@/lib/utils";
interface PickupProps {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
  order: AnyOrder;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export default function Pickup({ children, setOrder, order, open, setOpen }: PickupProps) {
  const { updateGlobalState } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [when, setWhen] = useState<string>("immediate");

  const createPickupOrder = () => {
    if (name === "") {
      return toastError("L'ordine deve avere un nome di un cliente");
    }

    const content = { name, when, phone };

    fetchRequest<{ order: PickupOrder; isNewOrder: boolean }>(
      "POST",
      "/api/orders/",
      "createPickupOrder",
      { ...content }
    ).then((pickupOrder) => {
      if (pickupOrder.isNewOrder) {
        toastSuccess("Ordine creato con successo");
        updateGlobalState(pickupOrder.order, "add");
      }

      setOrder(pickupOrder.order);
    });
  };

  return (
    <DialogWrapper
      size={order.id !== -1 ? "large" : "medium"}
      open={open}
      trigger={
        <div className="w-full pl-4 pb-4">
          <Button className="w-full text-3xl h-24 rounded-none">
            <Plus className="mr-2 h-5 w-5" /> Ordine per asporto {children}
          </Button>
        </div>
      }
      onOpenChange={() => {
        setName("");
        setPhone("");
        setWhen("immediate");

        setOpen(!open);
      }}
      contentClassName={cn(
        "flex flex-col gap-6 items-center max-w-screen max-h-screen",
        order.id !== -1 && "h-[95vh]"
      )}
    >
      {order.id == -1 ? (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full space-y-2">
            <Label htmlFor="name" className="text-xl">
              Nome cliente
            </Label>
            <Input
              type="text"
              id="name"
              className="w-full text-center text-6xl h-16 uppercase focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
              ref={(ref) => {
                addRefs(ref);
                // if (ref) {
                //   ref.value = "";
                // }
              }}
              value={name}
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="when" className="text-xl">
              Quando?
            </Label>
            <WhenSelector
              ref={(ref) => {
                addRefs(ref);
              }}
              className="h-16 text-6xl w-full"
              value={when}
              source="pickup"
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
                        Se viene inserito un numero di telefono, il programma controlla se esiste
                        già un cliente con questo numero:
                        <ul className="list-disc ml-4">
                          <li>
                            Se esiste, utilizzerà il cognome del cliente esistente per l'ordine.
                          </li>
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
              className="w-full text-center text-6xl h-16 uppercase focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
              ref={(ref) => {
                addRefs(ref);
                // if (ref) {
                //   ref.value = "";
                // }
              }}
              value={phone}
              defaultValue={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            onClick={createPickupOrder}
            ref={(ref) => addRefs(ref)}
          >
            CREA ORDINE
          </Button>
        </div>
      ) : (
        <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen}>
          <OrderTable />
        </OrderProvider>
      )}
    </DialogWrapper>
  );
}
