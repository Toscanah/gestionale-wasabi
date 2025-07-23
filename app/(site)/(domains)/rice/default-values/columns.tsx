"use client";

import TableColumn from "@/app/(site)/components/table/TableColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "@phosphor-icons/react";
import { RiceBatch } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

const columns = ({
  debouncedUpdateBatch,
  removeRiceBatch,
}: {
  debouncedUpdateBatch: (batchId: number, field: keyof Omit<RiceBatch, "id">, value: any) => void;
  removeRiceBatch: (batchId: number) => Promise<void>;
}): ColumnDef<RiceBatch>[] => [
  TableColumn({
    header: "#",
    isRowIndex: true,
  }),

  TableColumn<RiceBatch>({
    header: "Etichetta",
    cellContent: (row) => {
      const batch = row.original;

      return (
        <Input
          type="text"
          placeholder="Modifica etichetta"
          defaultValue={batch.label || ""}
          onChange={(e) => debouncedUpdateBatch(batch.id, "label", e.target.value)}
        />
      );
    },
  }),

  TableColumn({
    header: "Valore",
    cellContent: (row) => {
      const batch = row.original;

      return (
        <Input
          type="number"
          placeholder="Modifica valore"
          defaultValue={batch.amount}
          onChange={(e) =>
            debouncedUpdateBatch(batch.id, "amount", parseFloat(e.target.value) || 0)
          }
        />
      );
    },
  }),

  TableColumn({
    header: "Elimina",
    cellContent: (row) => (
      <Button className="group w-full" onClick={() => removeRiceBatch(row.original.id)}>
        <Trash
          size={24}
          className="transform transition-transform duration-300 
                          group-hover:rotate-[360deg] hover:font-bold hover:drop-shadow-2xl"
        />
      </Button>
    ),
  }),
];

export default columns;
