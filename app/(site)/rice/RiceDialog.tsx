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

interface RiceDialogProps {
  variant: "header" | "sidebar";
}

export default function RiceDialog({ variant }: RiceDialogProps) {
  const { rice, updateTotalRice, resetRice } = useWasabiContext();
  const [newRice, setNewRice] = useState<Rice>({ ...rice.total, amount: 0 });
  const [riceToAdd, setRiceToAdd] = useState<number>(0);
  const [riceToRemove, setRiceToRemove] = useState<number>(0);
  const [riceDefaults, setRiceDefaults] = useState<number[]>([]);

  useEffect(() => {
    const defaults = localStorage.getItem("riceDefaults");

    if (defaults) {
      setRiceDefaults(JSON.parse(defaults) as number[]);
    } else {
      localStorage.setItem("riceDefaults", JSON.stringify([]));
    }
  }, []);

  const handleAddRice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setRiceToAdd(value);
    setNewRice({ ...newRice, amount: value });
  };

  const handleRemoveRice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setRiceToRemove(value);
    setNewRice({ ...newRice, amount: -value });
  };

  const handleSelectChange = (val: string) => {
    const selectedRice = Number(val);
    setRiceToAdd(selectedRice)
    setNewRice({ ...newRice, amount: selectedRice });
  };

  return (
    <DialogWrapper
      onOpenChange={() => setNewRice({ ...rice.total, amount: 0 })}
      desc="Tutti i valori sono calcolati in grammi"
      title={
        <>
          Gestione riso 
          {/* <span className="text-muted-foreground">(tutto in grammi)</span> */}
        </>
      }
      hasHeader
      contentClassName="border-t-4 border-t-gray-400 w-[40vw]"
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
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="rice" className="text-xl">
            Valori di base
          </Label>
          <SelectWrapper
            className="h-10 text-xl"
            groups={
              riceDefaults && riceDefaults.length > 0
                ? [
                    {
                      items: riceDefaults
                        .sort((a, b) => b - a)
                        .map((item) => ({
                          name: String(item),
                          value: String(item),
                        })),
                    },
                  ]
                : []
            }
            onValueChange={handleSelectChange}
          />
        </div>

        <div className="flex w-full justify-between gap-4">
          <div className="space-y-2">
            <Label htmlFor="add-rice" className="text-xl">
              Riso da AGGIUNGERE
            </Label>
            <Input
              className="h-10 text-2xl"
              type="number"
              id="add-rice"
              value={riceToAdd}
              onChange={handleAddRice}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rem-rice" className="text-xl">
              Riso da TOGLIERE
            </Label>
            <Input
              className="h-10 text-2xl"
              type="number"
              id="rem-rice"
              value={riceToRemove}
              onChange={handleRemoveRice}
            />
          </div>
        </div>

        <div className="flex w-full justify-between gap-4">
          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-xl">
              Soglia avviso
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
      </div>
    </DialogWrapper>
  );
}
