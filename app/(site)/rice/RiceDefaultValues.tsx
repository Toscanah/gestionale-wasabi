import { useCallback, useEffect, useState } from "react";
import DialogWrapper from "../components/ui/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { toastSuccess } from "../lib/utils/toast";
import fetchRequest from "../lib/core/fetchRequest";
import { RiceBatch } from "@prisma/client";
import { debounce } from "lodash";

export default function RiceDefaultValues() {
  const defaultNewBatch = { id: -1, amount: 0, label: "" };
  const [newBatch, setNewBatch] = useState<RiceBatch>(defaultNewBatch);
  const [riceBatches, setRiceBatches] = useState<RiceBatch[]>([]);

  const fetchRiceBatches = async () =>
    fetchRequest<RiceBatch[]>("GET", "/api/rice/", "getRiceBatches").then(setRiceBatches);

  useEffect(() => {
    fetchRiceBatches();
  }, []);

  const addRiceBatch = async () => {
    if (!newBatch?.amount || !newBatch?.label) return;
    const { amount, label } = newBatch;

    fetchRequest<RiceBatch>("POST", "/api/rice/", "addRiceBatch", {
      batch: { amount, label },
    }).then((createdBatch) => {
      setRiceBatches((prev) => {
        const isDuplicate = prev.some((batch) => batch.id === createdBatch.id);

        if (!isDuplicate) {
          return [...prev, createdBatch];
        }

        return prev;
      });

      setNewBatch(defaultNewBatch);
      toastSuccess("Valore aggiunto con successo");
    });
  };

  const removeRiceBatch = async (batchId: number) =>
    fetchRequest("DELETE", "/api/rice/", "deleteRiceBatch", { id: batchId }).then(() => {
      setRiceBatches((prev) => prev.filter((batch) => batch.id !== batchId));
      toastSuccess("Valore rimosso con successo");
    });

  const debouncedUpdateBatch = useCallback(
    debounce(
      (batchId: number, field: keyof Omit<RiceBatch, "id">, value: any) =>
        fetchRequest("PATCH", "/api/rice/", "updateRiceBatch", { batchId, field, value }).then(() =>
          toastSuccess("Valore aggiornato con successo")
        ),
      1000
    ),
    []
  );

  return (
    <DialogWrapper
      size="medium"
      title="Valori di default del riso"
      desc="I valori si salvano automaticamente"
      contentClassName="border-t-4 border-t-gray-400"
      onOpenChange={() => fetchRiceBatches()}
      autoFocus={false}
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer ">
          Valori di default
        </SidebarMenuSubButton>
      }
    >
      <div className="max-h-[40vh] overflow-y-auto">
        {riceBatches.length > 0 ? (
          <div className="flex flex-col gap-2 items-center w-full">
            {riceBatches.map((riceBatch) => (
              <div className="flex items-center gap-2 w-full" key={riceBatch.id}>
                <Input
                  className="w-[40%]"
                  type="number"
                  placeholder="Modifica valore"
                  defaultValue={riceBatch.amount}
                  onChange={(e) =>
                    debouncedUpdateBatch(riceBatch.id, "amount", parseFloat(e.target.value) || 0)
                  }
                />
                <Input
                  className="w-[40%]"
                  type="text"
                  placeholder="Modifica etichetta"
                  defaultValue={riceBatch.label || ""}
                  onChange={(e) => debouncedUpdateBatch(riceBatch.id, "label", e.target.value)}
                />
                <Button className="group w-[20%]" onClick={() => removeRiceBatch(riceBatch.id)}>
                  <Trash
                    size={24}
                    className="transform transition-transform duration-300 
                          group-hover:rotate-[360deg] hover:font-bold hover:drop-shadow-2xl"
                  />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center text-xl">Nessun valore di default presente!</div>
        )}
      </div>

      <Separator />

      <div className="w-full flex gap-2">
        <Input
          className="w-[40%]"
          type="number"
          placeholder="Aggiungi valore"
          value={newBatch.amount || ""}
          onChange={(e) =>
            setNewBatch((prevBatch) => ({
              ...prevBatch,
              amount: parseFloat(e.target.value) || 0,
            }))
          }
        />

        <Input
          className="w-[40%]"
          type="text"
          placeholder="Aggiungi etichetta"
          value={newBatch.label || ""}
          onChange={(e) =>
            setNewBatch((prevBatch) => ({
              ...prevBatch,
              label: e.target.value,
            }))
          }
        />

        <Button className="w-[20%]" onClick={addRiceBatch} disabled={!newBatch.amount}>
          <Plus size={24} />
        </Button>
      </div>
    </DialogWrapper>
  );
}
