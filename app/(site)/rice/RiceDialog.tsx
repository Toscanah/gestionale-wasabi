import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gear } from "@phosphor-icons/react";
import { Rice } from "@prisma/client";
import { useWasabiContext } from "../context/WasabiContext";
import fetchRequest from "../util/functions/fetchRequest";
import { useEffect, useState } from "react";

export default function RiceDialog() {
  const { rice, updateTotalRice } = useWasabiContext();
  const [newRice, setNewRice] = useState<Rice>(rice.total);

  return (
    <Dialog onOpenChange={(open) => setNewRice(rice.total)}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Gear className="mr-2 h-4 w-4" /> Riso
        </Button>
      </DialogTrigger>

      <DialogContent>
        {/* <DialogHeader>
          <DialogTitle className="mb-4">Gestione riso</DialogTitle>
        </DialogHeader> */}

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="rice" className="text-xl">
              Riso attuale <span className="text-muted-foreground">(grammi)</span>
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={() => updateTotalRice(newRice)} className="w-full">
              Salva
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
