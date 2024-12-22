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
import { RiceDefault } from "../types/RiceDefault";

interface RiceDialogProps {
  variant: "header" | "sidebar";
}

export default function RiceDialog({ variant }: RiceDialogProps) {
  const { rice, updateTotalRice, resetRice } = useWasabiContext();
  const [newRice, setNewRice] = useState<Rice>({ ...rice.total, amount: 0 });
  const [riceToAdd, setRiceToAdd] = useState<number>(0);
  const [riceToRemove, setRiceToRemove] = useState<number>(0);
  const [riceDefaults, setRiceDefaults] = useState<RiceDefault[]>([]);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getRiceDefaults;
  }, []);

  const getRiceDefaults = () => {
    const defaults = localStorage.getItem("riceDefaults");

    if (!defaults) {
      const initialDefaults: RiceDefault[] = [];
      localStorage.setItem("riceDefaults", JSON.stringify(initialDefaults));
      setRiceDefaults(initialDefaults);
    } else {
      setRiceDefaults(JSON.parse(defaults) as RiceDefault[]);
    }
  };

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
    setRiceToAdd(selectedRice);
    setNewRice({ ...newRice, amount: selectedRice });
  };

  return (
    <DialogWrapper
      size="medium"
      onOpenChange={() => {
        setNewRice({ ...rice.total, amount: 0 });
        setRiceToAdd(0);
        setRiceToRemove(0);
        getRiceDefaults();
      }}
      title={"Gestione riso"}
      desc="Tutti i valori sono calcolati in grammi"
      contentClassName="border-t-4 border-t-gray-400 gap-6"
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
            size="small"
            variant="delete"
            onDelete={resetRice}
            trigger={
              <Button className="w-full border-red-600 text-red-600 text-xl" variant={"outline"}>
                Azzera
              </Button>
            }
          >
            Stai per azzerare il riso, sei sicuro?
          </DialogWrapper>

          <Button type="submit" onClick={() => updateTotalRice(newRice)} className="w-full text-xl">
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
                        .sort((a, b) => b.value - a.value)
                        .map((item) => ({
                          name: item.label ? String(item.label) : String(item.value),
                          value: String(item.value),
                        })),
                    },
                  ]
                : []
            }
            onValueChange={handleSelectChange}
          />
        </div>

        <div className="flex w-full justify-between space-x-4">
          <div className="space-y-2 w-full">
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

          <div className="space-y-2 w-full">
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

        <div className="flex w-full justify-between space-x-4">
          <div className="space-y-2 w-full">
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

          <div className="space-y-2 w-full ">
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
