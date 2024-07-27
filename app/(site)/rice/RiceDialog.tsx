import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gear } from "@phosphor-icons/react";
import { Rice } from "@prisma/client";
import { useWasabiContext } from "../orders/WasabiContext";
import fetchRequest from "../util/fetchRequest";

export default function RiceDialog() {
  const { rice, setRice } = useWasabiContext();

  const updateRice = () => {
    fetchRequest("POST", "/api/rice/", "updateRice", { rice });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Gear className="mr-2 h-4 w-4" /> Riso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Gestione riso</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="rice">Riso attuale</Label>
            <Input
              type="number"
              id="rice"
              value={rice}
              onChange={(e) => setRice(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={updateRice}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
