import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gear } from "@phosphor-icons/react";
import { Rice } from "@prisma/client";
import { useWasabiContext } from "../context/WasabiContext";
import { useState } from "react";
import DialogWrapper from "../components/dialog/DialogWrapper";

export default function RiceDialog() {
  const { rice, updateTotalRice, resetRice } = useWasabiContext();
  const [newRice, setNewRice] = useState<Rice>({ ...rice.total, amount: 0 });

  return (
    <DialogWrapper
      onOpenChange={() => setNewRice({ ...rice.total, amount: 0 })}
      title="Gestione riso"
      contentClassName="border-t-4 border-t-gray-400"
      trigger={
        <Button variant={"outline"}>
          <Gear className="mr-2 h-4 w-4" /> Riso
        </Button>
      }
      footer={
        <>
          <DialogWrapper
            variant="delete"
            title="Sei sicuro?"
            onDelete={() => resetRice()}
            trigger={
              <Button className="w-full border-red-600 text-red-600" variant={"outline"}>
                Resetta
              </Button>
            }
          >
            Stai per resettare il riso
          </DialogWrapper>

          <Button type="submit" onClick={() => updateTotalRice(newRice)} className="w-full">
            Salva
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="rice" className="text-xl">
            Riso da aggiungere <span className="text-muted-foreground">(grammi)</span>
          </Label>
          <Input
            className="h-10 text-2xl"
            type="number"
            id="rice"
            value={newRice.amount}
            onChange={(e) =>
              setNewRice({
                id: 1,
                amount: e.target.valueAsNumber,
                threshold: newRice.threshold,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="threshold" className="text-xl">
            Soglia avviso <span className="text-muted-foreground">(grammi)</span>
          </Label>
          <Input
            className="h-10 text-2xl"
            type="number"
            id="threshold"
            value={newRice.threshold}
            onChange={(e) =>
              setNewRice({ id: 1, amount: newRice.amount, threshold: e.target.valueAsNumber })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total" className="text-xl">
            Riso totale fin ad ora
          </Label>
          <Input
            disabled
            className="h-10 text-2xl"
            type="number"
            id="total"
            value={rice.total.amount}
          />
        </div>
      </div>
    </DialogWrapper>
  );
}
