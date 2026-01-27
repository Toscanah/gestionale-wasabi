import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { OrderByType } from "@/lib/shared";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WhenSelector from "@/components/shared/filters/select/WhenSelector";
import { useWasabiContext } from "../../../../context/WasabiContext";
import useFocusCycle from "../../../../../../hooks/focus/useFocusCycle";
import { toastError, toastSuccess } from "../../../../../../lib/shared/utils/global/toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Question } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { OrderProvider } from "@/context/OrderContext";
import OrderTable from "../../single-order/OrderTable";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";

interface PickupProps {
  setOrder: Dispatch<SetStateAction<OrderByType>>;
  order: OrderByType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export default function Pickup({ children, setOrder, order, open, setOpen }: PickupProps) {
  const { updateGlobalState } = useWasabiContext();
  const { handleKeyDown, addRefs } = useFocusCycle();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState("immediate");

  const createPickupMutation = trpc.orders.createPickup.useMutation({
    onSuccess: (pickupOrder) => {
      if (pickupOrder.isNewOrder) {
        toastSuccess("Ordine creato con successo");
        updateGlobalState(pickupOrder.order, "add");
      }
      setOrder(pickupOrder.order);
    },
    onError: () => {
      toastError("Errore nella creazione dell'ordine");
    },
  });

  const createPickupOrder = () => {
    if (createPickupMutation.isPending) return;

    if (name === "") {
      return toastError("L'ordine deve avere un nome di un cliente");
    }

    const content = { name, when, phone };
    createPickupMutation.mutate(content);
  };

  return (
    <WasabiDialog
      putSeparator
      putUpperBorder
      title={order.id !== -1 ? "" : "Ordine per asporto"}
      size={order.id !== -1 ? "large" : "medium"}
      open={open}
      trigger={
        <div className="w-full pl-4 pb-4">
          <Button className="w-full text-3xl h-24 rounded-none">Asporto {children}</Button>
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
              className="w-full text-center !text-6xl h-16 uppercase focus-visible:ring-0"
              ref={(ref) => addRefs(ref)}
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
              ref={(ref) => addRefs(ref)}
              className="h-16 text-6xl w-full"
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
                    <Separator />
                    <ul className="text-sm list-disc ml-4 space-y-1">
                      <li>
                        Se viene inserito un numero di telefono, il programma controlla se esiste
                        già un cliente associato.
                      </li>
                      <li>
                        Se non viene inserito un numero, verrà utilizzato il nome specificato.
                      </li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Label>

            <Input
              type="number"
              id="phone"
              className="w-full text-center !text-6xl h-16 uppercase focus-visible:ring-0"
              ref={(ref) => addRefs(ref)}
              defaultValue={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            ref={(ref) => addRefs(ref)}
            onClick={createPickupOrder}
            // onKeyDown={handleKeyDown}
            disabled={createPickupMutation.isPending}
          >
            {createPickupMutation.isPending ? "..." : "CREA ORDINE"}
          </Button>
        </div>
      ) : (
        <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen}>
          <OrderTable />
        </OrderProvider>
      )}
    </WasabiDialog>
  );
}
