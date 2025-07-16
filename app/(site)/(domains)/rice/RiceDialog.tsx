import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gear } from "@phosphor-icons/react";
import { RiceBatch, RiceLogType } from "@prisma/client";
import { useWasabiContext } from "../../context/WasabiContext";
import { useEffect, useState } from "react";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import SelectWrapper from "../../components/ui/select/SelectWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import RiceHistory from "./RiceHistory";
import fetchRequest from "../../lib/api/fetchRequest";
import { Rice } from "../../hooks/useRice";
import useFocusOnClick from "../../hooks/focus/useFocusOnClick";

interface RiceDialogProps {
  variant: "header" | "sidebar";
}

export default function RiceDialog({ variant }: RiceDialogProps) {
  const { rice, updateRice, resetRice } = useWasabiContext();

  const defaultNewRice: Rice = { ...rice, total: 0, threshold: 0 };

  const [newRice, setNewRice] = useState<Rice>(defaultNewRice);
  const [riceToAdd, setRiceToAdd] = useState<number>(0);
  const [riceToRemove, setRiceToRemove] = useState<number>(0);
  const [selectedRiceBatchId, setSelectedRiceBatchId] = useState<number | null>(null);
  const [riceBatches, setRiceBatches] = useState<RiceBatch[]>([]);

  useFocusOnClick(["threshold", "add-rice", "rem-rice"]);

  const fetchRiceBatches = () =>
    fetchRequest<RiceBatch[]>("GET", "/api/rice/", "getRiceBatches").then(setRiceBatches);

  useEffect(() => {
    fetchRiceBatches();
  }, []);

  const handleAddRice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.valueAsNumber;

    if (value === undefined || value === null || isNaN(value)) {
      value = 0;
    }

    setRiceToAdd(value);
    setNewRice({ ...newRice, total: value });
    setSelectedRiceBatchId(null);
  };

  const handleRemoveRice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.valueAsNumber;

    if (value === undefined || value === null || isNaN(value)) {
      value = 0;
    }

    setRiceToRemove(value);
    setNewRice({ ...newRice, total: -value });
    setSelectedRiceBatchId(null);
  };

  const handleSelectChange = (val: string) => {
    const selectedRice = Number(val);
    const batch = riceBatches.find((batch) => batch.amount === selectedRice);

    if (batch) {
      setSelectedRiceBatchId(batch.id);
      setRiceToAdd(selectedRice);
      setNewRice({ ...newRice, total: selectedRice });
    }
  };

  const logRiceChange = () => {
    if (selectedRiceBatchId) {
      fetchRequest("POST", "/api/rice/", "addRiceLog", {
        riceBatchId: selectedRiceBatchId,
        manualValue: null,
        type: RiceLogType.BATCH,
      });
    } else if (riceToAdd || riceToRemove) {
      const manualValue = riceToAdd - riceToRemove;
      fetchRequest("POST", "/api/rice/", "addRiceLog", {
        riceBatchId: null,
        manualValue: manualValue,
        type: RiceLogType.MANUAL,
      });
    }
  };

  const handleSave = () => {
    logRiceChange();
    updateRice(newRice);
  };

  const handleOpenChange = () => {
    setNewRice(defaultNewRice);
    setRiceToAdd(0);
    setRiceToRemove(0);
    setSelectedRiceBatchId(null);
    fetchRiceBatches();
  };

  return (
    <DialogWrapper
      size="medium"
      autoFocus={false}
      onOpenChange={handleOpenChange}
      title={"Gestione riso"}
      desc="Tutti i valori sono calcolati in grammi"
      contentClassName="border-t-4 border-t-gray-400 gap-6"
      trigger={
        variant == "sidebar" ? (
          <SidebarMenuSubButton className="hover:cursor-pointer">Quantità</SidebarMenuSubButton>
        ) : (
          <Button variant={"outline"} className="w-full">
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
            onDelete={() => {
              setNewRice(defaultNewRice);
              resetRice();
            }}
            trigger={
              <Button className="w-full border-red-600 text-red-600 text-xl" variant={"outline"}>
                Azzera
              </Button>
            }
          >
            Stai per azzerare il riso, sei sicuro?
          </DialogWrapper>

          <Button type="submit" onClick={handleSave} className="w-full text-xl">
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
            disabled={riceBatches.length === 0}
            className="h-10 text-xl"
            groups={
              riceBatches && riceBatches.length > 0
                ? [
                    {
                      items: riceBatches
                        .sort((a, b) => b.amount - a.amount)
                        .map((item) => ({
                          name: String(item.label || item.amount),
                          value: String(item.amount),
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
              onChange={(e) => setNewRice({ ...newRice, threshold: e.target.valueAsNumber || 0 })}
            />
          </div>

          <div className="space-y-2 w-full ">
            <Label htmlFor="total" className="text-xl">
              Riso totale fin ad ora
            </Label>

            <div className="flex gap-2">
              <Input
                disabled
                className="h-10 text-2xl"
                type="number"
                id="total"
                value={rice.total}
              />

              <RiceHistory />
            </div>
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
}
