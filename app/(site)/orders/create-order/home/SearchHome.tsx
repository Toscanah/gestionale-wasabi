import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import useFocusCycle from "@/app/(site)/components/hooks/useFocusCycle";
import { OrderProvider } from "@/app/(site)/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import OrderTable from "../../single-order/OrderTable";
import { AnyOrder } from "@/app/(site)/models";
import { HandPalm } from "@phosphor-icons/react";
import Home from "./Home";
import { toastError } from "@/app/(site)/functions/util/toast";
import generateEmptyOrder from "@/app/(site)/functions/order-management/generateEmptyOrder";
import { OrderType } from "@prisma/client";

interface SearchHomeProps {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  order: AnyOrder;
  children: ReactNode;
}

export default function SearchHome({ children, setOrder, open, setOpen, order }: SearchHomeProps) {
  const { handleKeyDown, addRefs } = useFocusCycle();

  const [phone, setPhone] = useState<string>("");
  const [doorbell, setDoorbell] = useState<string>("");

  const phoneRef = useRef<HTMLInputElement>(null);
  const doorbellRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => addRefs(phoneRef.current, doorbellRef.current, buttonRef.current), []);

  const searchHome = () => {
    // check che manda direttamente all'ordine in base al numero di telefono

    if (phone !== "" || doorbell !== "") {
      setOrder(generateEmptyOrder(OrderType.HOME));
      setOpen(true);
    } else {
      toastError("Assicurati di aver inserito un numero di telefono o un campanello");
    }
  };

  return (
    <div className="w-full h-full flex items-center px-4 pb-4 gap-4">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <Input
            placeholder="Telefono"
            autoFocus
            type="text"
            className="w-full text-center text-lg rounded-none border-foreground focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
            //  border-l-0
            ref={phoneRef}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="w-full space-y-2">
          <Input
            placeholder="Campanello"
            type="text"
            className="w-full text-center text-lg rounded-none border-foreground focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
            //  border-l-0
            ref={doorbellRef}
            value={doorbell}
            onChange={(e) => setDoorbell(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <Button
        ref={buttonRef}
        type="submit"
        className="w-52 text-3xl rounded-none h-full"
        onClick={searchHome}
      >
        Vai {children}
      </Button>

      <DialogWrapper
        size="large"
        open={open}
        onOpenChange={() => setOpen(!open)}
        contentClassName="flex flex-col gap-6 items-center max-w-screen max-h-screen h-[95vh]"
      >
        {order.id == -1 ? (
          <Home setOrder={setOrder} initialPhone={phone ?? ""} initialDoorbell={doorbell ?? ""} />
        ) : (
          <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen}>
            <OrderTable />
          </OrderProvider>
        )}
      </DialogWrapper>
    </div>
  );
}
