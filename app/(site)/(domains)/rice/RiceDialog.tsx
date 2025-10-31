import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gear } from "@phosphor-icons/react";
import { useWasabiContext } from "../../context/WasabiContext";
import { useEffect, useState } from "react";
import WasabiDialog from "../../components/ui/wasabi/WasabiDialog";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import RiceHistory from "./RiceHistory";
import useFocusOnClick from "../../hooks/focus/useFocusOnClick";
import { trpc } from "@/lib/server/client";
import WasabiSelect from "../../components/ui/wasabi/WasabiSelect";

interface RiceDialogProps {
  variant: "header" | "sidebar";
}

export default function RiceDialog({ variant }: RiceDialogProps) {
  const { rice, updateRice, resetRice } = useWasabiContext();

  const [threshold, setThreshold] = useState<number>(rice.threshold);
  const [riceToAdd, setRiceToAdd] = useState<number>(0);
  const [riceToRemove, setRiceToRemove] = useState<number>(0);
  const [selectedRiceBatchId, setSelectedRiceBatchId] = useState<number | null>(null);
  const { data: riceBatches = [], refetch } = trpc.rice.getBatches.useQuery();

  useFocusOnClick(["threshold", "add-rice", "rem-rice"]);

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

  useEffect(() => setThreshold(rice.threshold), [rice.threshold]);

  return (
    <WasabiDialog
      size="medium"
      autoFocus={false}
      onOpenChange={(open) => {
        if (open) refetch();
        resetForm();
      }}
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
          <WasabiDialog
            size="small"
            variant="delete"
            onDelete={handleReset}
            trigger={
              <Button className="flex-1 border-red-600 text-red-600 text-xl" variant="outline">
                Azzera
              </Button>
            }
          >
            Stai per azzerare il riso, sei sicuro?
          </WasabiDialog>

          <Button type="submit" onClick={handleSave} className="flex-1 text-xl">
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

          <WasabiSelect
            appearance="form"
            mode="single"
            disabled={riceBatches.length === 0}
            selectedValue={selectedRiceBatchId !== null ? String(selectedRiceBatchId) : undefined}
            groups={[
              {
                options: riceBatches
                  .sort((a, b) => b.amount - a.amount)
                  .map((batch) => ({
                    label: batch.label || `${batch.amount}`,
                    value: String(batch.id),
                  })),
              },
            ]}
            onChange={handleSelectChange}
          />
        </div>

        {/* Inputs for add/remove */}
        <div className="flex w-full justify-between space-x-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="add-rice" className="text-xl">
              Riso da AGGIUNGERE
            </Label>
            <Input
              className="text-2xl"
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
              className="text-2xl"
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
              className="text-2xl"
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
              <Input disabled className="text-2xl" type="number" id="total" value={rice.total} />

              <RiceHistory />
            </div>
          </div>
        </div>
      </div>
    </WasabiDialog>
  );
}
