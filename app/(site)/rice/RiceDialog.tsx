import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gear } from "@phosphor-icons/react";
import { Rice } from "@prisma/client";
import { useWasabiContext } from "../context/WasabiContext";
import { useEffect, useState } from "react";
import DialogWrapper from "../components/dialog/DialogWrapper";
import SelectWrapper from "../components/select/SelectWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";

export default function RiceDialog({ variant }: { variant: "header" | "sidebar" }) {
  const { rice, updateTotalRice, resetRice } = useWasabiContext();
  const [newRice, setNewRice] = useState<Rice>({ ...rice.total, amount: 0 });
  const [riceDefaults, setRiceDefaults] = useState<number[]>([]);

  useEffect(() => {
    const defaults = localStorage.getItem("riceDefaults");

    if (defaults) {
      setRiceDefaults(JSON.parse(defaults) as number[]);
    } else {
      localStorage.setItem("riceDefaults", JSON.stringify([]));
    }
  }, []);

  return (
    <DialogWrapper
      onOpenChange={() => setNewRice({ ...rice.total, amount: 0 })}
      title="Gestione riso"
      contentClassName="border-t-4 border-t-gray-400"
      trigger={
        variant == "sidebar" ? (
          <SidebarMenuSubButton className="hover:cursor-pointer">Quantità</SidebarMenuSubButton>
        ) : (
          <Button variant={"outline"} className="w-44">
            <Gear className="mr-2 h-4 w-4" />
            Riso
          </Button>
        )
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
          <SelectWrapper
            className="h-10"
            groups={
              riceDefaults && riceDefaults.length > 0
                ? [
                    {
                      items: riceDefaults.map((item) => ({
                        name: String(item),
                        value: String(item),
                      })),
                    },
                  ]
                : []
            }
            onValueChange={(val) =>
              setNewRice({
                id: 1,
                amount: Number(val),
                threshold: newRice.threshold,
              })
            }
          />
        </div>

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
            Riso totale fin ad ora <span className="text-muted-foreground">(grammi)</span>
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
