"use client";

import { useCallback, useEffect, useState } from "react";
import WasabiDialog from "../../../components/ui/wasabi/WasabiDialog";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { toastSuccess } from "../../../lib/utils/global/toast";
import { debounce } from "lodash";
import useTable from "@/app/(site)/hooks/table/useTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/server/client";
import { RiceBatchType } from "@/prisma/generated/schemas";

const DEFAULT_NEW_BATCH: RiceBatchType = { id: -1, amount: 0, label: "" };

export type RiceDefaultValuesTableMeta = {
  debouncedUpdateBatch: (
    batchId: number,
    field: keyof Omit<RiceBatchType, "id">,
    value: any
  ) => void;
  removeRiceBatch: (batchId: number) => Promise<void>;
};

export default function RiceDefaultValues() {
  const [newBatch, setNewBatch] = useState<RiceBatchType>(DEFAULT_NEW_BATCH);

  const utils = trpc.useUtils();
  const { data: riceBatches = [], refetch: refetchRiceBatches } = trpc.rice.getBatches.useQuery(
    undefined,
    {}
  );

  const addBatch = trpc.rice.addBatch.useMutation({
    onSuccess: () => {
      utils.rice.getBatches.invalidate();
      setNewBatch(DEFAULT_NEW_BATCH);
      toastSuccess("Valore aggiunto con successo");
    },
  });

  const removeBatch = trpc.rice.deleteBatch.useMutation({
    onSuccess: () => {
      utils.rice.getBatches.invalidate();
      toastSuccess("Valore rimosso con successo");
    },
  });

  const updateBatch = trpc.rice.updateBatch.useMutation({
    onSuccess: () => {
      toastSuccess("Valore aggiornato con successo");
    },
  });

  const debouncedUpdateBatch = useCallback(
    debounce((batchId: number, field: keyof Omit<RiceBatchType, "id">, value: any) => {
      updateBatch.mutate({ batchId, field, value });
    }, 1000),
    []
  );

  const table = useTable<RiceBatchType>({
    data: riceBatches,
    columns,
    meta: {
      debouncedUpdateBatch,
      removeRiceBatch: async (batchId: number) => await removeBatch.mutateAsync({ id: batchId }),
    },
  });

  return (
    <WasabiDialog
      size="medium"
      title="Valori di default del riso"
      desc="I valori si salvano automaticamente"
      putUpperBorder
      onOpenChange={() => refetchRiceBatches()}
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

        <Button
          className="w-full"
          onClick={() => addBatch.mutate({ batch: { ...newBatch } })}
          disabled={!newBatch.amount}
        >
          <Plus size={24} />
        </Button>
      </div>
    </WasabiDialog>
  );
}
