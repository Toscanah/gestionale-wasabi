import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gear } from "@phosphor-icons/react";
import { RiceBatch, RiceLogType } from "@prisma/client";
import { useWasabiContext } from "../../context/WasabiContext";
import { useEffect, useState } from "react";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import WasabiSingleSelect from "../../components/ui/select/WasabiSingleSelect";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import RiceHistory from "./RiceHistory";
import fetchRequest from "../../lib/api/fetchRequest";
import useFocusOnClick from "../../hooks/focus/useFocusOnClick";

interface RiceDialogProps {
  variant: "header" | "sidebar";
}

export default function RiceDialog({ variant }: RiceDialogProps) {
  const { rice, updateRice, resetRice } = useWasabiContext();

  const [threshold, setThreshold] = useState<number>(rice.threshold);
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
    const value = e.target.valueAsNumber || 0;
    setRiceToAdd(value);
    setRiceToRemove(0);
    setSelectedRiceBatchId(null);
  };

  const handleRemoveRice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber || 0;
    setRiceToRemove(value);
    setRiceToAdd(0);
    setSelectedRiceBatchId(null);
  };

  const handleSelectChange = (val: string) => {
    const selectedId = Number(val);
    const batch = riceBatches.find((b) => b.id === selectedId);
    if (!batch) return;

    setSelectedRiceBatchId(batch.id);
    setRiceToAdd(batch.amount);
    setRiceToRemove(0);
  };

  const handleSave = async () => {
    const manualValue = riceToAdd - riceToRemove;

    if (selectedRiceBatchId !== null) {
      updateRice({
        delta: riceToAdd,
        threshold,
        log: "batch",
        selectedRiceBatchId,
      });
    } else if (manualValue !== 0) {
      updateRice({
        delta: manualValue,
        threshold,
        log: "manual",
      });
    }
  };

  const handleReset = () => {
    resetRice();
    resetForm();
  };

  const resetForm = () => {
    setRiceToAdd(0);
    setRiceToRemove(0);
    setSelectedRiceBatchId(null);
  };

  useEffect(() => {
    setThreshold(rice.threshold);
  }, [rice.threshold]);

  return (
    <DialogWrapper
      size="medium"
      autoFocus={false}
      onOpenChange={resetForm}
      title="Gestione riso"
      desc="Tutti i valori sono calcolati in grammi"
      contentClassName="gap-4"
      putUpperBorder
      trigger={
        variant === "sidebar" ? (
          <SidebarMenuSubButton className="hover:cursor-pointer">Quantità</SidebarMenuSubButton>
        ) : (
          <Button variant="outline" className="w-full">
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
            onDelete={handleReset}
            trigger={
              <Button className="w-full border-red-600 text-red-600 text-xl" variant="outline">
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
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="rice" className="text-xl">
            Valori di base
          </Label>
          <WasabiSingleSelect
            disabled={riceBatches.length === 0}
            className="h-10 text-xl"
            value={selectedRiceBatchId !== null ? String(selectedRiceBatchId) : undefined}
            groups={[
              {
                items: riceBatches
                  .sort((a, b) => b.amount - a.amount)
                  .map((batch) => ({
                    name: batch.label || `${batch.amount}`,
                    value: String(batch.id),
                  })),
              },
            ]}
            onValueChange={handleSelectChange}
          />
        </div>

        {/* Inputs for add/remove */}
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

        {/* Threshold + Total */}
        <div className="flex w-full justify-between space-x-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="threshold" className="text-xl">
              Soglia avviso
            </Label>
            <Input
              className="h-10 text-2xl"
              type="number"
              id="threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.valueAsNumber || 0)}
            />
          </div>

          <div className="space-y-2 w-full">
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
