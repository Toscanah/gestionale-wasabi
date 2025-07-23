"use client";

import { useCallback, useEffect, useState } from "react";
import DialogWrapper from "../../../components/ui/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { toastSuccess } from "../../../lib/utils/toast";
import fetchRequest from "../../../lib/api/fetchRequest";
import { RiceBatch } from "@prisma/client";
import { debounce } from "lodash";
import getTable from "@/app/(site)/lib/utils/getTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import { Label } from "@/components/ui/label";

const DEFAULT_NEW_BATCH: RiceBatch = { id: -1, amount: 0, label: "" };

export default function RiceDefaultValues() {
  const [newBatch, setNewBatch] = useState<RiceBatch>(DEFAULT_NEW_BATCH);
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

      setNewBatch(DEFAULT_NEW_BATCH);
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

  const table = getTable({
    data: riceBatches,
    columns: columns({ debouncedUpdateBatch, removeRiceBatch }),
  });

  return (
    <DialogWrapper
      size="medium"
      title="Valori di default del riso"
      desc="I valori si salvano automaticamente"
      putUpperBorder
      onOpenChange={() => fetchRiceBatches()}
      autoFocus={false}
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer ">
          Valori di default
        </SidebarMenuSubButton>
      }
    >
      <div className="overflow-y-auto">
        {riceBatches.length > 0 ? (
          <Table table={table} tableClassName="max-h-full" />
        ) : (
          <div className="w-full text-center text-xl">Nessun valore di default presente!</div>
        )}
      </div>

      <Separator />

      <div className="w-full flex flex-col gap-4 justify-center items-center ">
        <div className="w-full flex justify-center items-center gap-4">
          <div className="w-full space-y-2">
            <Label htmlFor="label">Etichetta</Label>
            <Input
              id="label"
              className="w-full"
              type="text"
              placeholder="Etichetta"
              value={newBatch.label || ""}
              onChange={(e) =>
                setNewBatch((prevBatch) => ({
                  ...prevBatch,
                  label: e.target.value,
                }))
              }
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="amount">Valore</Label>
            <Input
              id="amount"
              className="w-full"
              type="number"
              placeholder="Valore"
              value={newBatch.amount || ""}
              onChange={(e) =>
                setNewBatch((prevBatch) => ({
                  ...prevBatch,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <Button className="w-full" onClick={addRiceBatch} disabled={!newBatch.amount}>
          <Plus size={24} />
        </Button>
      </div>
    </DialogWrapper>
  );
}
