import { Dispatch, SetStateAction, useState } from "react";
import { AnyOrder } from "../types/PrismaOrders";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard, ForkKnife, Money } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";

enum TYPE_OF_PAYMENT {
  CASH = "cash",
  CARD = "card",
  VOUCH = "vouch",
}

export default function Payment({
  setPayDialog,
  order,
}: {
  setPayDialog: Dispatch<SetStateAction<boolean>>;
  order: AnyOrder;
}) {
  const [cash, setCash] = useState<number>(0);
  const [card, setCard] = useState<number>(0);
  const [vouch, setVouch] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full flex justify-between flex-col gap-4">
        <Button onClick={() => setPayDialog(false)} className="w-full">
          Torna all'ordine
        </Button>

        <div className="flex justify-between">
          <div className="space-y-4">
            <div className="w-64 h-64 rounded-md border flex items-center justify-center">
              <Money size={128} />
            </div>
            <div className="space-y-2">
              <Label>Contanti</Label>
              <Input value={cash} onChange={(e) => setCash(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-64 h-64 rounded-md border flex items-center justify-center">
              <CreditCard size={128} />
            </div>
            <div className="space-y-2">
              <Label>Carta</Label>
              <Input value={card} onChange={(e) => setCard(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-64 h-64 rounded-md border flex items-center justify-center">
              <ForkKnife size={128} />
            </div>
            <div className="space-y-2">
              <Label>Buoni pasto</Label>
              <Input value={vouch} onChange={(e) => setVouch(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-64 h-64 rounded-md border flex items-center justify-center">
              <Coins size={128} />
            </div>
            <div className="space-y-2">
              <Label>Credito</Label>
              <Input value={credit} onChange={(e) => setCredit(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-4xl flex justify-between h-full gap-8">
        <div className="flex flex-col gap-2 w-1/2 h-full justify-end">
          <div>Euro pagati con contanti: {cash !== 0 && cash}</div>
          <div>Euro pagati con la carrta: {card !== 0 && card}</div>
          <div>Euro pagati con i buoni pasto: {vouch !== 0 && vouch}</div>
          <div>Euro pagati con i crediti: {credit !== 0 && credit}</div>
          <Separator className="w-full" orientation="horizontal" />
          <div>Subtotale: {cash + card + vouch + credit}</div>
          <div>Rimanente: {(order.total ?? 0) - (cash + card + vouch + credit)}</div>
          <Separator className="w-full" orientation="horizontal" />
          <div>Totale da pagare: {order.total}</div>
        </div>

        <div className="flex flex-col gap-2 w-1/2 text-4xl items-center text-center h-full">
          <h1>Vuoi procedere con l'incasso?</h1>
          <h1 className="">{order.total}</h1>

          <div className="w-full flex gap-2 h-full">
            <Button className="w-full h-full" variant={"destructive"}>
              Cancella
            </Button>
            <Button
              className="w-full h-full bg-green-500"
              disabled={(order.total ?? 0) - (cash + card + vouch + credit) > 0}
            >
              Conferma
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
